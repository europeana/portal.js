<template>
  <b-list-group
    :id="elementId"
    class="auto-suggest-dropdown"
    data-qa="search query options"
    role="listbox"
    :aria-label="$t('searchSuggestions')"
  >
    <b-list-group-item
      v-for="(option, index) in value"
      :key="index"
      :to="option.link"
      :data-qa="option.qa"
      role="option"
      :aria-selected="index === focus"
      :class="{ 'hover': index === focus }"
      @click="blurInput"
      @focus="index === focus"
      @mouseover="focus = index"
      @mouseout="focus = null"
      @mousedown.prevent
    >
      <i18n
        v-if="option.i18n"
        :path="option.i18n.path"
      >
        <template
          v-for="(slot, slotIndex) in option.i18n.slots"
          #[slot.name]
        >
          <TextHighlighter
            :key="slotIndex"
            v-model="slot.value"
          />
        </template>
      </i18n>
      <template
        v-else-if="option.texts"
      >
        <TextHighlighter
          v-model="option.texts"
        />
      </template>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import TextHighlighter from '../generic/TextHighlighter';

  export default {
    name: 'SearchQueryOptions',

    components: {
      TextHighlighter
    },

    props: {
      /**
       * Array of objects for the query options to render as links
       *
       * @example with i18n and named slots
       * [
       *   {
       *     link: { path: '/en/search', query: { query: 'map' } },
       *     qa: 'search button',
       *     i18n: { path: 'header.searchFor', slots: [
       *       { name: 'query', value: { text: 'map', highlight: true } }
       *     ] }
       *   }
       * ]
       * @example with non-i18n texts
       * [
       *   {
       *     link: { path: '/en/search', query: { query: '"Charles Dickens"' } },
       *     qa: 'Charles Dickens search suggestion',
       *     texts: [
       *       { text: 'Charles ', highlight: false },
       *       { text: 'D', highlight: true },
       *       { text: 'ickens ', highlight: false }
       *     ]
       *   }
       * ]
       */
      value: {
        type: Array,
        required: true
      },

      elementId: {
        type: String,
        default: null
      },

      inputRefName: {
        type: String,
        default: 'searchbox'
      }
    },

    data() {
      return {
        focus: null
      };
    },

    computed: {
      firstOptionHasFocus() {
        return this.focus === 0;
      },

      lastOptionHasFocus() {
        return this.focus === (this.value.length - 1);
      },

      noOptionHasFocus() {
        return this.focus === null;
      },

      inputRef() {
        return this.$parent.$refs[this.inputRefName];
      },

      inputElement() {
        // refs may point to a component or direct to an HTML element
        return this.inputRef.$el ? this.inputRef.$el : this.inputRef;
      }
    },

    mounted() {
      this.inputElement.addEventListener('keydown', this.keydown);
      document.addEventListener('mouseup', this.clickOutside);
    },

    methods: {
      keydown(event) {
        switch (event.keyCode) {
        case 27: // Escape key
          this.blurInput();
          break;
        case 9: // Tab key
          this.closeDropdown();
          break;
        case 38: // Up key
          this.keydownUp();
          break;
        case 40: // Down key
          this.keydownDown();
          break;
        }
      },

      keydownUp() {
        this.focus = (this.noOptionHasFocus || this.firstOptionHasFocus) ? this.value.length - 1 : this.focus - 1;
        this.selectSuggestion();
      },

      keydownDown() {
        this.focus = (this.noOptionHasFocus || this.lastOptionHasFocus) ? 0 : this.focus + 1;
        this.selectSuggestion();
      },

      blurInput() {
        this.inputElement.blur();
      },

      clickOutside(event) {
        const isParent = (event.target === this.inputElement);
        const isChild = this.$el.contains(event.target);
        const isSubmit = event.target.closest('.search-query');
        const isClear = event.target.classList.contains('clear');

        if (!(isParent || isChild || isSubmit)) {
          this.closeDropdown(isClear);
        }
      },

      closeDropdown() {
        this.focus = null;
        this.selectSuggestion();
      },

      selectSuggestion() {
        if (this.focus && this.value[this.focus]) {
          this.$emit('select', this.value[this.focus].link);
        } else {
          // fallback to the query by unselecting any suggestions.
          this.$emit('select', null);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .auto-suggest-dropdown {
    display: block;
    box-shadow: $boxshadow-light;
    position: absolute;
    top: 3.45rem;
    width: 100%;
    z-index: 20;
    border-radius: 0;
    background-color: $white;
    transition: $standard-transition;

    .list-group-item {
      border: 0;
      border-radius: 0;
      box-shadow: none;
      padding: 1rem 1.25rem 1rem 3.4rem;
      color: $black;
      font-size: 1rem;
      text-decoration: none;
      text-align: left;

      &:focus {
        background-color: $offwhite;
      }

      &:before {
        @extend .icon-font;
        font-size: 1.1rem;
        content: '\e92b';
        left: 1rem;
        top: 1rem;
        position: absolute;
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &.hover {
        background-color: $blue;
        color: $white;
      }
    }

    .loading {
      font-size: 0.75rem;
    }
  }

  form:focus-within .auto-suggest-dropdown {
    display: block;
  }

  .btn {
    border-radius: 0 $border-radius $border-radius 0;

    img {
      display: flex;
    }
  }
</style>
