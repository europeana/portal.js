<template>
  <b-list-group
    :id="id"
    role="listbox"
    data-qa="search query options"
    :aria-label="$t('searchSuggestions')"
  >
    <!--
      Will also fire on 'Enter' as @click event is also triggered on keyboard navigation
      @event click
      @property {number} index - option index
      @property {string} query - option link query
    -->
    <b-list-group-item
      v-for="(option, index) in options"
      ref="options"
      :key="index"
      :data-qa="option.qa"
      role="option"
      button
      @click="handleClick(index, option)"
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
  import matchHighlight from 'autosuggest-highlight/match';
  import parseHighlight from 'autosuggest-highlight/parse';
  import TextHighlighter from '../generic/TextHighlighter';
  import elasticApmReporterMixin from '@/mixins/elasticApmReporter';

  export default {
    name: 'SearchQueryOptions',

    components: {
      TextHighlighter
    },

    mixins: [elasticApmReporterMixin],

    props: {
      /**
       * Id to set a unique value for each options list group
       */
      id: {
        type: String,
        default: 'search-form-options'
      },
      /**
       * If `false` will not fetch suggestions
       */
      suggest: {
        type: Boolean,
        default: true
      },
      /**
       * Text value to search for and highlight suggestions
       */
      text: {
        type: String,
        default: null
      },
      /**
       * Enitty type(s) to look up suggestions for the term
       * @values agent,concept,organization,place,timespan
       */
      type: {
        type: String,
        default: 'agent,concept,place,timespan'
      },
      /**
       * Defines context of the SearchQueryOptions component
       */
      advancedSearch: {
        type: Boolean,
        default: false
      },
      /**
       * Advanced search field for which a suggested option might be selected to be used as the search value
       * Used for tracking
       */
      advancedSearchField: {
        type: String,
        default: null
      },
      /**
       * State of the search form
       * Used for tracking
       */
      submitting: {
        type: String,
        default: null
      },
      /**
       * Static options to use in style guide
       */
      staticOptions: {
        type: Array,
        default: () => []
      },
      /**
       * Display state of the options
       */
      showSearchOptions: {
        type: Boolean,
        default: false
      },
      /**
       * v-model value
       */
      value: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        // TODO: replace this with use of v-model value?
        activeSuggestionsQueryTerm: null,
        fetchFailed: false,
        gettingSuggestions: false,
        suggestions: {}
      };
    },

    computed: {
      onCollectionPage() {
        return this.$route.name?.startsWith('collections-type-all');
      },

      collectionSearchOption() {
        return {
          link: this.searchInCollectionLinkGen(this.text),
          qa: 'search in collection button',
          query: this.text,
          i18n: {
            path: this.text ? 'header.inCollection' : 'header.searchForEverythingInCollection',
            slots: [
              { name: 'query', value: { highlight: true, text: this.text } },
              { name: 'collection', value: { text: this.$store.state.search.collectionLabel } }
            ]
          }
        };
      },

      globalSearchOption() {
        const globalSearchOption = {
          link: this.linkGen(this.text),
          qa: 'search entire collection button',
          query: this.text,
          i18n: {
            slots: this.text ? [
              { name: 'query', value: { highlight: true, text: this.text } }
            ] : []
          }
        };

        if (this.onCollectionPage && !this.advancedSearch) {
          globalSearchOption.i18n.path = this.text ? 'header.entireCollection' : 'header.searchForEverythingInEntireCollection';
        } else {
          globalSearchOption.i18n.path = this.text ? 'header.searchFor' : 'header.searchForEverything';
        }

        return globalSearchOption;
      },

      options() {
        if (this.onCollectionPage && !this.advancedSearch) {
          return [this.collectionSearchOption, this.globalSearchOption].concat(this.staticOptions);
        } else {
          return [this.globalSearchOption].concat(this.suggestionSearchOptions).concat(this.staticOptions);
        }
      },

      suggestionSearchOptions() {
        return Object.keys(this.suggestions).map((suggestionId) => (
          {
            entityId: suggestionId,
            query: this.suggestionQuery(this.suggestions[suggestionId]),
            qa: `${this.suggestions[suggestionId]} search suggestion`,
            texts: this.highlightSuggestion(this.suggestions[suggestionId])
          }
        ));
      }
    },

    watch: {
      showSearchOptions(newVal) {
        if (newVal === true) {
          this.$parent.$refs.searchdropdown.addEventListener('keydown', this.handleKeyDown);
        } else {
          this.$parent.$refs.searchdropdown.removeEventListener('keydown', this.handleKeyDown);
        }
      },
      text() {
        this.fetchSuggestions();
      },
      submitting(newVal) {
        if (newVal) {
          this.trackSuggestionClick(newVal);
        }
      },
      onSearchablePage() {
        return this.$store.state.search.active;
      }
    },

    methods: {
      async fetchSuggestions() {
        if (!this.suggest || !this.text || this.text === '') {
          this.suggestions = {};
          this.activeSuggestionsQueryTerm = null;
          return;
        }

        // Don't go getting more suggestions if we are already waiting for some or they already exist.
        if (this.gettingSuggestions || (this.text === this.activeSuggestionsQueryTerm)) {
          return;
        }

        const locale = this.$i18n.locale;
        this.gettingSuggestions = true;

        try {
          this.activeSuggestionsQueryTerm = this.text;
          const suggestions = await this.$apis.entity.suggest(this.text, {
            language: locale,
            type: this.type
          });
          this.suggestions = suggestions.reduce((memo, suggestion) => {
            const localisedSuggestionLabels = [suggestion?.prefLabel?.[locale]]
              .concat(suggestion?.altLabel?.[locale] || []);
            memo[suggestion.id] = localisedSuggestionLabels.find((label) => matchHighlight(label, this.text).length > 0) || localisedSuggestionLabels[0];
            return memo;
          }, {});
        } catch (error) {
          this.fetchFailed = true;
        } finally {
          this.gettingSuggestions = false;
          // If the query has changed in the meantime, go get new suggestions now
          if (this.activeSuggestionsQueryTerm !== this.text) {
            this.fetchSuggestions();
          }
          // Only reset after checking the changed query to prevent infinite fetch
          if (this.fetchFailed) {
            this.activeSuggestionsQueryTerm = null;
            this.suggestions = {};
          }
        }
      },

      handleClick(index, option) {
        this.$emit('input', option);
        this.trackSuggestionClick(option.query, index);
        this.suggestions = {};
        this.activeSuggestionsQueryTerm = null;
      },

      // Highlight the user's query in a suggestion
      // FIXME: only re-highlight when new suggestions come in, not immediately
      //        after the query changes?
      highlightSuggestion(value) {
        if (this.text) {
          const matchQuery = this.text?.replace(/(^")|("$)/g, '');
          // Find all the suggestion labels that match the query
          const matches = matchHighlight(value, matchQuery);
          return parseHighlight(value, matches);
        }
      },

      linkGen(queryTerm, path) {
        const query = this.onSearchablePage ? { ...this.$route.query } : {};
        query.query = queryTerm || '';

        return {
          path: path || this.localePath({
            name: 'search'
          }),
          query
        };
      },

      searchInCollectionLinkGen(query) {
        return this.linkGen(query, this.$route?.path);
      },

      suggestionQuery(suggestion) {
        if (this.advancedSearch) {
          return suggestion;
        } else {
          return suggestion ? `"${suggestion.replace(/(^")|("$)/g, '')}"` : undefined;
        }
      },

      trackSuggestionClick(query, index) {
        if (this.advancedSearch) {
          if (index >= 1) {
            this.$matomo?.trackEvent('Advanced search autosuggest', 'Advanced search autosuggest option is selected', `${this.advancedSearchField}: ${query}`);
          } else if (this.options.length >= 2) {
            this.$matomo?.trackEvent('Advanced search autosuggest', 'Advanced search autosuggest option is not selected', `${this.advancedSearchField}: ${query}`);
          }
        } else if (!this.onCollectionPage) { // Skip click tracking while on a collection page, there will never be suggestions.
          if (index >= 1) {
            this.$matomo?.trackEvent('Autosuggest_option_selected', 'Autosuggest option is selected', query);
            this.logApmTransaction({
              name: 'Search - select autosuggest option',
              labels: {
                'search_params_query': query,
                'suggestion_rank': index
              }
            });
          } else if (this.options.length >= 2) {
            this.$matomo?.trackEvent('Autosuggest_option_not_selected', 'Autosuggest option is not selected', query);
          }
        }
      },

      handleKeyDown(event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          this.navigateWithArrowKeys(event);
        }
        if (event.key === 'Escape' || this.advancedSearchDirectEnter(event)) {
          this.$emit('hide');
        }
      },

      advancedSearchDirectEnter(event) {
        return this.advancedSearch && (event.key === 'Enter' && this.$refs.options.map((option) => option.$el || option).indexOf(event.target) === -1);
      },

      navigateWithArrowKeys(event) {
        const quicksearchOptionsElements = this.$parent.$refs.quicksearch?.$children[0]?.$refs.options || [];
        const searchQueryOptionsElements = this.$refs.options || [];
        const searchDropdownOptionsElements = (searchQueryOptionsElements).concat(quicksearchOptionsElements);

        const activeOption = searchDropdownOptionsElements.map((option) => option.$el || option).indexOf(event.target);

        if (searchDropdownOptionsElements.length) {
          if (activeOption === -1) {
            this.getElement(searchDropdownOptionsElements[0]).focus();
          }
          if (event.key === 'ArrowDown' && activeOption < searchDropdownOptionsElements.length - 1) {
            this.getElement(searchDropdownOptionsElements[activeOption + 1]).focus();
          }
          if (event.key === 'ArrowUp' && activeOption > 0) {
            this.getElement(searchDropdownOptionsElements[activeOption - 1]).focus();
          }
        }
      },

      getElement(element) {
        return element.$el || element;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .list-group-item {
    border: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 1rem 1.25rem 1rem 3.4rem;
    color: $greyblack;
    font-size: $font-size-base;
    text-decoration: none;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: $bp-4k) {
      font-size: $font-size-base-4k;
      padding: 1.5rem calc(1.5 * 1.25rem) 1.5rem calc(1.5 * 3.4rem);
    }

    &::before {
      @extend %icon-font;

      font-size: 1.1rem;
      content: '\e92b';
      left: 1rem;
      top: 1rem;
      position: absolute;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.1rem);
        left: 1.5rem;
        top: 1.5rem;
        width: calc(1.5 * 1.5rem);
        height: calc(1.5 * 1.5rem);
      }
    }

    &:focus,
    &:hover {
      background-color: $blue;
      color: $white;
    }

    &.list-item-quick-search {
      padding: 0 1.25rem 1.3125rem;

      @media (min-width: $bp-4k) {
        padding: 0 calc(1.5 * 1.25rem) calc(1.5 * 1.3125rem);
      }

      &::before {
        display: none;
      }
    }
  }

  .loading {
    font-size: 0.75rem;

    @media (min-width: $bp-4k) {
      font-size: calc(1.5 * 0.75rem)
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

<docs lang="md">
  ```jsx
  <SearchQueryOptions
    :staticOptions="[
      {
        qa: 'search button',
        i18n: { path: 'header.searchFor', slots: [
          { name: 'query', value: { text: 'map', highlight: true } }
        ] }
      },
      {
        qa: 'Charles Dickens search suggestion',
        texts: [
          { text: 'Charles ', highlight: false },
          { text: 'D', highlight: true },
          { text: 'ickens ', highlight: false }
        ]
      }
    ]"
  />
  ```
</docs>
