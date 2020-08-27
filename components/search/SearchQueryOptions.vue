<template>
  <b-list-group
    v-show="isActive"
    :id="elementId"
    class="auto-suggest-dropdown"
    data-qa="search suggestions"
    role="listbox"
    :aria-label="$t('searchSuggestions')"
    :aria-hidden="!isActive"
  >
    <b-list-group-item
      v-if="showLoader && isLoading"
      class="loading"
    >
      {{ $t('loadingResults') }}{{ $t('formatting.ellipsis') }}
    </b-list-group-item>

    <template v-else>
      <template
        v-if="pillLabel"
      >
        <b-list-group-item
          :to="linkGen(query)"
          class="search"
          role="option"
          data-qa="search in collection button"
          :aria-label="$t('search')"
          :aria-selected="focus === 0"
          :class="{ 'hover': focus === 0 }"
          @mouseover="focus = 0"
          @mouseout="focus = null"
          @focus="focus === 0"
          @mousedown.prevent
        >
          <i18n
            path="header.inCollection"
            tag="span"
          >
            <strong>{{ query }}</strong>
            <span>{{ pillLabel.values[0] }}</span>
          </i18n>
        </b-list-group-item>
        <!-- @click.prevent="toggleSearchAndRemovePill" -->
        <b-list-group-item
          :to="linkGen(query)"
          class="search"
          role="option"
          data-qa="search entire collection button"
          :aria-label="$t('search')"
          :aria-selected="focus === 1"
          :class="{ 'hover': focus === 1 }"
          @mouseover="focus = 1"
          @mouseout="focus = null"
          @focus="focus === 1"
          @mousedown.prevent
        >
          <i18n
            path="header.entireCollection"
            tag="span"
          >
            <strong>{{ query }}</strong>
          </i18n>
        </b-list-group-item>
      </template>
      <template
        v-else
      >
        <b-list-group-item
          :to="linkGen(query)"
          class="search"
          role="option"
          data-qa="search button"
          :aria-label="$t('search')"
          :aria-selected="focus === 0"
          :class="{ 'hover': focus === 0 }"
          @mouseover="focus = 0"
          @mouseout="focus = null"
          @focus="focus === 0"
          @mousedown.prevent
        >
          <i18n
            path="header.searchFor"
            tag="span"
          >
            <strong>{{ query }}</strong>
          </i18n>
        </b-list-group-item>
      </template>
      <b-list-group-item
        v-for="(val, name, index) in value"
        :key="index + 1"
        role="option"
        data-qa="search suggestion"
        :aria-selected="index + 1 === focus"
        :to="linkGen(val)"
        :class="{ 'hover': index + 1 === focus }"
        :data-index="index + 1"
        @mouseover="focus = index + 1"
        @mouseout="focus = null"
        @focus="index + 1 === focus"
        @mousedown.prevent
      >
        <template
          v-for="(part, partIndex) in highlightResult(val)"
        >
          <strong
            v-if="part.highlight"
            :key="partIndex"
            class="highlight"
            data-qa="highlighted"
          >{{ part.text }}</strong> <!-- Do not put onto a new line -->
          <span
            v-else
            :key="partIndex"
          >{{ part.text }}</span> <!-- Do not put onto a new line -->
        </template>
      </b-list-group-item>
    </template>
  </b-list-group>
</template>

<script>
  import match from 'autosuggest-highlight/match';
  import parse from 'autosuggest-highlight/parse';

  export default {
    name: 'SearchQueryOptions',

    props: {
      // Property names are identifiers, emitted when suggestion is selected.
      // Property values are the text for.the match
      // @example
      //     {
      //       "http://data.europeana.eu/concept/base/83": "World War I",
      //       "http://data.europeana.eu/agent/base/60496": "Poquelin, Jean-Baptiste"
      //     }
      value: {
        type: Object,
        default: () => {}
      },

      query: {
        type: String,
        default: ''
      },

      linkGen: {
        type: Function,
        default: (val) => val
      },

      elementId: {
        type: String,
        default: null
      },

      inputRefName: {
        type: String,
        default: 'searchbox'
      },

      showLoader: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        focus: null,
        isActive: Object.keys(this.value || {}).length > 0,
        isLoading: false
      };
    },

    computed: {
      suggestionValues() {
        return Object.keys(this.value);
      },

      suggestionLabels() {
        return Object.values(this.value);
      },

      numberOfSuggestions() {
        return this.suggestionValues.length;
      },

      noSuggestionHasFocus() {
        return this.focus === null;
      },

      inputRef() {
        return this.$parent.$refs[this.inputRefName];
      },

      inputElement() {
        // refs may point to a component or direct to an HTML element
        return this.inputRef.$el ? this.inputRef.$el : this.inputRef;
      },

      firstSuggestionHasFocus() {
        return this.focus === 0;
      },

      lastSuggestionHasFocus() {
        return this.focus === (this.numberOfSuggestions);
      },

      selectedSuggestionLabel() {
        return this.suggestionLabels[this.focus - 1] || null;
      },

      pillLabel() {
        return this.$store.state.search.pill;
      }
    },

    watch: {
      '$route.query'() {
        this.closeDropdown();
        this.isActive = false;
      },

      value() {
        this.isActive = true;
        this.isLoading = false;
        this.focus = null;
        this.selectSuggestion();
      },

      query() {
        this.isLoading = true;
      }
    },

    mounted() {
      console.log('pillLabel');
      console.log(this.pillLabel);
      this.inputElement.addEventListener('keyup', this.keyup);
      document.addEventListener('mouseup', this.clickOutside);
    },

    methods: {
      keyup(event) {
        switch (event.keyCode) {
        case 27: // Escape key
          this.closeDropdown();
          break;
        case 38: // Up key
          if (!this.isActive) return;
          this.keyupUp();
          break;
        case 40: // Down key
          if (!this.isActive) return;
          this.keyupDown();
          break;
        }
      },

      keyupUp() {
        if (this.noSuggestionHasFocus || this.firstSuggestionHasFocus) {
          this.focus = this.numberOfSuggestions;
        } else {
          this.focus = this.focus - 1;
        }

        this.selectSuggestion();
      },

      keyupDown() {
        if (this.noSuggestionHasFocus || this.lastSuggestionHasFocus) {
          this.focus = 0;
        } else {
          this.focus = this.focus + 1;
        }

        this.selectSuggestion();
      },

      clickOutside(event) {
        if (!this.isActive) return;

        const isParent = (event.target === this.inputElement);
        const isChild = this.$el.contains(event.target);
        const isSubmit = event.target.closest('.search-query');
        const isClear = event.target.classList.contains('clear');

        if (!(isParent || isChild || isSubmit)) {
          this.closeDropdown(isClear);
        }
      },

      // Highlight the user's query in a suggestion
      // FIXME: only re-highlight when new suggestions come in, not immediately
      //        after the query changes?
      highlightResult(value) {
        // Find all the suggestion labels that match the query
        const matches = match(value, this.query);
        return parse(value, matches);
      },

      closeDropdown(showSearch) {
        this.isActive = false;
        this.focus = null;
        this.selectSuggestion();

        if (!showSearch) {
          this.$emit('hide-search');
        }
      },

      selectSuggestion() {
        if (this.focus === 0) {
          this.$emit('select', this.query);
        } else if (this.selectedSuggestionLabel) {
          this.$emit('select', this.selectedSuggestionLabel);
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

    a.list-group-item {
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
