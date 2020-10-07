<template>
  <b-list-group
    :id="elementId"
    class="auto-suggest-dropdown"
    data-qa="search suggestions"
    role="listbox"
    :aria-label="$t('searchSuggestions')"
    :aria-hidden="!isActive"
  >
    <template
      v-if="onCollectionPage"
    >
      <b-list-group-item
        :to="inCollectionLinkGen(query)"
        class="search"
        data-qa="search in collection button"
        role="option"
        :aria-label="$t('search')"
        :aria-selected="focus === 0"
        :class="{ 'hover': focus === 0 }"
        @click="blurInput"
        @focus="focus === 0"
        @mouseover="focus = 0"
        @mouseout="focus = null"
        @mousedown.prevent
      >
        <i18n
          v-if="query"
          path="header.inCollection"
          tag="span"
        >
          <strong>{{ query }}</strong>
          <span>{{ entityCollectionLabel }}</span>
        </i18n>
        <span
          v-else
        >
          {{ $t('header.searchForEverythingInCollection', [entityCollectionLabel]) }}
        </span>
      </b-list-group-item>
      <b-list-group-item
        :to="queryLinkGen(query)"
        class="search"
        data-qa="search entire collection button"
        :aria-label="$t('search')"
        :aria-selected="focus === 1"
        :class="{ 'hover': focus === 1 }"
        @click.prevent="blurInput(); removeCollectionLabel();"
        @focus="focus === 1"
        @mouseover="focus = 1"
        @mouseout="focus = null"
        @mousedown.prevent
      >
        <i18n
          v-if="query"
          path="header.entireCollection"
          tag="span"
        >
          <strong>{{ query }}</strong>
        </i18n>
        <span
          v-else
        >
          {{ $t('header.searchForEverythingInEntireCollection') }}
        </span>
      </b-list-group-item>
    </template>
    <template
      v-else
    >
      <b-list-group-item
        :to="queryLinkGen(query)"
        class="search"
        role="option"
        data-qa="search button"
        :aria-label="$t('search')"
        :aria-selected="focus === 0"
        :class="{ 'hover': focus === 0 }"
        @click="blurInput"
        @focus="focus === 0"
        @mouseover="focus = 0"
        @mouseout="focus = null"
        @mousedown.prevent
      >
        <i18n
          v-if="query"
          path="header.searchFor"
          tag="span"
        >
          <strong>{{ query }}</strong>
        </i18n>
        <span
          v-else
        >
          {{ $t('header.searchForEverything') }}
        </span>
      </b-list-group-item>
      <b-list-group-item
        v-for="(val, name, index) in value"
        :key="index + 1"
        role="option"
        :data-qa="val + ' search suggestion'"
        :aria-selected="index + 1 === focus"
        :to="suggestionLinkGen(val)"
        :class="{ 'hover': index + 1 === focus }"
        @click="blurInput"
        @focus="index + 1 === focus"
        @mouseover="focus = index + 1"
        @mouseout="focus = null"
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
      // TODO: potential refactor here to only pass the suggestion labels in. URIs are currently not used anywhere.
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

      suggestionLinkGen: {
        type: Function,
        default: (val) => val
      },

      queryLinkGen: {
        type: Function,
        default: (val) => val
      },

      inCollectionLinkGen: {
        type: Function,
        default: (val) => val
      },

      removeCollectionLabel: {
        type: Function,
        default: () => {}
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
      },

      onCollectionPage: {
        type: Boolean,
        default: false
      },

      entityCollectionLabel: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        focus: null
      };
    },

    computed: {
      options() {
        if (this.onCollectionPage) return [this.inCollectionLinkGen(this.query), this.queryLinkGen(this.query)];
        return [this.queryLinkGen(this.query)].concat(this.suggestionLabels.map(val => this.suggestionLinkGen(val)));
      },

      suggestionLabels() {
        return this.value ? Object.values(this.value) : [];
      },

      numberOfSuggestions() {
        return this.suggestionLabels.length;
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

      isActive() {
        return this.options.length >= 1;
      },

      firstSuggestionHasFocus() {
        return this.focus === 0;
      },

      lastSuggestionHasFocus() {
        return this.focus === (this.numberOfSuggestions);
      },

      removeCollectionLinkTo() {
        const query = {
          ...this.queryUpdatesForFacetChanges({ collection: null }),
          view: this.view,
          query: this.query || ''
        };
        return {
          path: this.$path({
            name: 'search'
          }),
          query
        };
      }
    },

    watch: {
      '$route.query'() {
        this.closeDropdown();
      },

      value() {
        this.focus = null;
        this.selectSuggestion();
      },

      query() {
        this.selectSuggestion();
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
          if (!this.isActive) return;
          this.keydownUp();
          break;
        case 40: // Down key
          if (!this.isActive) return;
          this.keydownDown();
          break;
        }
      },

      keydownUp() {
        if (this.onCollectionPage) {
          this.focus = (this.noSuggestionHasFocus || this.firstSuggestionHasFocus) ? 1 : this.focus - 1;
        } else {
          this.focus = (this.noSuggestionHasFocus || this.firstSuggestionHasFocus) ? this.numberOfSuggestions : this.focus - 1;
        }
        this.selectSuggestion();
      },

      keydownDown() {
        if (this.onCollectionPage) {
          this.focus = (this.noSuggestionHasFocus || this.focus === 1) ? 0 : this.focus + 1;
        } else {
          this.focus = (this.noSuggestionHasFocus || this.lastSuggestionHasFocus) ? 0 : this.focus + 1;
        }
        this.selectSuggestion();
      },

      blurInput() {
        this.inputElement.blur();
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
        const matchQuery = this.query ? this.query.replace(/(^")|("$)/g, '') : undefined;
        // Find all the suggestion labels that match the query
        const matches = match(value, matchQuery);
        return parse(value, matches);
      },

      closeDropdown() {
        this.focus = null;
        this.selectSuggestion();
      },

      selectSuggestion() {
        if (this.focus && this.options[this.focus]) {
          this.$emit('select', this.options[this.focus]);
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
