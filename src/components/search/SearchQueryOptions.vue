<template>
  <b-list-group
    :id="elementId"
    role="listbox"
    data-qa="search query options"
    :aria-label="$t('searchSuggestions')"
  >
    <b-list-group-item
      v-for="(option, index) in options"
      :key="index"
      ref="options"
      :data-qa="option.qa"
      :to="$link.to(option.link.path, option.link.query)"
      :href="$link.href(option.link.path, option.link.query)"
      role="option"
      :aria-selected="index === focus"
      @click="trackSuggestionClick(index, option.link.query.query)"
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
            :texts="slot.value"
          />
        </template>
      </i18n>
      <template
        v-else-if="option.texts"
      >
        <TextHighlighter
          :texts="option.texts"
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
      options: {
        type: Array,
        required: true
      },

      elementId: {
        type: String,
        default: null
      },

      inputRefName: {
        type: String,
        default: 'searchinput'
      },

      searchDropwdownRefName: {
        type: String,
        default: 'searchdropdown'
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
        return this.focus === (this.options.length - 1);
      },

      noOptionHasFocus() {
        return this.focus === null;
      },

      inputRef() {
        return this.$parent.$refs[this.inputRefName];
      },

      inputElement() {
        return this.inputRef?.$el || this.inputRef;
      },

      searchDropwdownRef() {
        return this.$parent.$refs[this.searchDropwdownRefName];
      },

      searchDropwdownElement() {
        // refs may point to a component or direct to an HTML element
        return this.searchDropwdownRef?.$el || this.searchDropwdownRef;
      }
    },

    mounted() {
      this.searchDropwdownElement?.addEventListener('keydown', this.keydown);
    },

    methods: {
      keydown(event) {
        switch (event.key) {
        case 'Escape':
          this.blurInput();
          break;
        case 'ArrowUp':
          this.keydownUp(event);
          break;
        case 'ArrowDown':
          this.keydownDown(event);
          break;
        }
      },

      keydownUp(event) {
        event.preventDefault();
        const newFocus = (this.noOptionHasFocus || this.firstOptionHasFocus) ? this.options.length - 1 : this.focus - 1;
        this.focus = newFocus;
        this.$refs.options[newFocus]?.focus();
      },

      keydownDown(event) {
        event.preventDefault();
        const newFocus = (this.noOptionHasFocus || this.lastOptionHasFocus) ? 0 : this.focus + 1;
        this.focus = newFocus;
        this.$refs.options[newFocus]?.focus();
      },

      blurInput() {
        this.inputElement.blur();
        this.$emit('blur');
      },

      onCollectionPage() {
        // Used for deciding if clicks on search suggestions should be tracked.
        // Uses window.location as the beforeRouteLeave call on collection pages
        // unsets the entity ID before the @click event fires on each search option.
        const collectionPagePattern = /(\/[a-z]{2})?\/collections\/(person|topic|time|organisation)\/([0-9]+)+/;
        return collectionPagePattern.test(window.location.href);
      },

      trackSuggestionClick(index, query) {
        // Skip click tracking while on a collection page, there will never be suggestions.
        if (!this.onCollectionPage()) {
          // While only triggered via @click here, these events are also tracked
          // in the submitForm logic of the SearchForm component for keyboard events.
          if (index >= 1) {
            this.$matomo?.trackEvent('Autosuggest_option_selected', 'Autosuggest option is selected', query);
          } else if (this.options.length >= 2) {
            this.$matomo?.trackEvent('Autosuggest_option_not_selected', 'Autosuggest option is not selected', query);
          }
        }
        this.blurInput();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

    .list-group-item {
      border: 0;
      border-radius: 0;
      box-shadow: none;
      padding: 1rem 1.25rem 1rem 3.4rem;
      color: $black;
      font-size: 1rem;
      text-decoration: none;
      text-align: left;

      &::before {
        @extend %icon-font;

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

      &:focus, &:hover {
        background-color: $blue;
        color: $white;
      }

      &.list-item-quick-search {
        padding: 0 1.25rem 1.3125rem;

        &::before {
          display: none;
        }
      }
    }

    .loading {
      font-size: 0.75rem;
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
