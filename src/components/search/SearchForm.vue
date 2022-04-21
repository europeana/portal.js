<template>
  <div
    ref="searchdropdown"
    class="open"
  >
    <b-button
      data-qa="back button"
      class="button-icon-only icon-back back-button"
      variant="light-flat"
      :aria-label="$t('header.backToMenu')"
      @click="toggleSearchBar()"
    />
    <b-form
      ref="form"
      role="search"
      aria-label="search form"
      data-qa="search form"
      inline
      autocomplete="off"
      @submit.prevent="submitForm"
    >
      <b-input-group
        role="combobox"
        :aria-owns="showSearchOptions ? 'search-form-options' : null"
        :aria-expanded="showSearchOptions"
        class="auto-suggest pr-3"
      >
        <b-form-input
          ref="searchinput"
          v-model="query"
          :placeholder="$t('searchPlaceholder')"
          name="query"
          data-qa="search box"
          role="searchbox"
          aria-autocomplete="list"
          :aria-controls="showSearchOptions ? 'search-form-options' : null"
          :aria-label="$t('search')"
          @input="getSearchSuggestions(query);"
          @focus="showSearchOptions = true; updateSuggestions();"
        />
      </b-input-group>
    </b-form>
    <b-button
      v-show="query"
      data-qa="clear button"
      class="button-icon-only icon-clear clear-button"
      variant="light-flat"
      :aria-label="$t('header.clearQuery')"
      @click="clearQuery"
    />
    <FilterToggleButton />
    <div
      v-if="showSearchOptions"
      class="auto-suggest-dropdown"
      data-qa="search form dropdown"
    >
      <SearchQueryOptions
        ref="searchoptions"
        :options="searchQueryOptions"
      />
      <QuickSearch
        v-if="showQuickSearch"
        ref="quicksearch"
      />
    </div>
  </div>
</template>

<script>
  import SearchQueryOptions from './SearchQueryOptions';
  import FilterToggleButton from './FilterToggleButton';
  import { mapGetters } from 'vuex';
  import match from 'autosuggest-highlight/match';
  import parse from 'autosuggest-highlight/parse';

  export default {
    name: 'SearchForm',

    components: {
      SearchQueryOptions,
      FilterToggleButton,
      QuickSearch: () => import('@/components/search/QuickSearch')
    },

    data() {
      return {
        query: null,
        gettingSuggestions: false,
        suggestions: {},
        activeSuggestionsQueryTerm: null,
        showSearchOptions: false
      };
    },

    computed: {
      ...mapGetters({
        view: 'search/activeView'
      }),

      onCollectionPage() {
        // Auto suggest on search form will be disabled on entity pages.
        return !!this.$store.state.entity?.id;
      },

      suggestionSearchOptions() {
        return Object.values(this.suggestions).map(suggestion => (
          {
            link: this.suggestionLinkGen(suggestion),
            qa: `${suggestion} search suggestion`,
            texts: this.highlightSuggestion(suggestion)
          }
        ));
      },

      globalSearchOption() {
        const globalSearchOption = {
          link: this.linkGen(this.query),
          qa: 'search entire collection button',
          i18n: {
            slots: this.query ? [
              { name: 'query', value: { highlight: true, text: this.query } }
            ] : []
          }
        };

        if (this.onCollectionPage) {
          globalSearchOption.i18n.path = this.query ? 'header.entireCollection' : 'header.searchForEverythingInEntireCollection';
        } else {
          globalSearchOption.i18n.path = this.query ? 'header.searchFor' : 'header.searchForEverything';
        }

        return globalSearchOption;
      },

      collectionSearchOption() {
        return {
          link: this.searchInCollectionLinkGen(this.query),
          qa: 'search in collection button',
          i18n: {
            path: this.query ? 'header.inCollection' : 'header.searchForEverythingInCollection',
            slots: [
              { name: 'query', value: { highlight: true, text: this.query } },
              { name: 'collection', value: { text: this.collectionLabel } }
            ]
          }
        };
      },

      searchQueryOptions() {
        if (this.onCollectionPage) {
          return [this.collectionSearchOption, this.globalSearchOption];
        } else {
          return [this.globalSearchOption].concat(this.suggestionSearchOptions);
        }
      },

      onSearchablePage() {
        return this.$store.state.search.active;
      },

      collectionLabel() {
        return this.$store.state.search.collectionLabel;
      },

      routePath() {
        return this.onSearchablePage ? this.$route.path : this.$path({ name: 'search' });
      },
      showQuickSearch() {
        return !this.onCollectionPage && !this.query;
      }
    },

    watch: {
      '$route.query.query'() {
        this.showSearchOptions = false;
        this.initQuery();
      },
      showSearchOptions(newVal) {
        if (newVal === true) {
          window.addEventListener('click', this.clickOutside);
          window.addEventListener('keydown', this.handleKeyDown);
        } else {
          window.removeEventListener('click', this.clickOutside);
          window.removeEventListener('keydown', this.handleKeyDown);
        }
      }
    },

    mounted() {
      this.initQuery();
      this.$nextTick(() => {
        this.$refs.searchinput.$el.focus();
      });
    },

    methods: {
      // Highlight the user's query in a suggestion
      // FIXME: only re-highlight when new suggestions come in, not immediately
      //        after the query changes?
      highlightSuggestion(value) {
        const matchQuery = this.query ? this.query.replace(/(^")|("$)/g, '') : undefined;
        // Find all the suggestion labels that match the query
        const matches = match(value, matchQuery);
        return parse(value, matches);
      },

      initQuery() {
        this.query = this.$route.query.query;
      },

      async submitForm() {
        let newRoute;

        // Matomo event: suggestions are present, but none is selected
        if (Object.keys(this.suggestions).length > 0) {
          // This only tracks keyboard events, click events are tracked in the SearchQueryOptions component.
          this.$matomo?.trackEvent('Autosuggest_option_not_selected', 'Autosuggest option is not selected', this.query);
        }

        const baseQuery = this.onSearchablePage ? this.$route.query : {};
        // `query` must fall back to blank string to ensure inclusion in URL,
        // which is required for analytics site search tracking
        const newRouteQuery = { ...baseQuery, ...{ page: 1, view: this.view, query: this.query || '' } };
        newRoute = { path: this.routePath, query: newRouteQuery };

        this.showSearchOptions = false;

        await this.$goto(newRoute);
      },

      updateSuggestions() {
        // Re-retrieve suggestions after the query was programmatically changed.
        if (this.query !== this.activeSuggestionsQueryTerm) {
          this.getSearchSuggestions(this.query);
        }
      },

      getSearchSuggestions(query) {
        if (!query || query === '') {
          this.suggestions = {};
          this.activeSuggestionsQueryTerm = null;
          return;
        }

        if (this.onCollectionPage) {
          return;
        }

        // Don't go getting more suggestions if we are already waiting for some or they already exist.
        if (this.gettingSuggestions || query === this.activeSuggestionsQueryTerm) {
          return;
        }

        const locale = this.$i18n.locale;
        this.gettingSuggestions = true;

        this.$apis.entity.suggest(query, {
          language: locale
        })
          .then(suggestions => {
            this.activeSuggestionsQueryTerm = query;
            this.suggestions = suggestions.reduce((memo, suggestion) => {
              const candidates = [(suggestion.prefLabel || {})[locale]]
                .concat((suggestion.altLabel || {})[locale]);
              memo[suggestion.id] = candidates.find(candidate => match(candidate, query).length > 0) || candidates[0];
              return memo;
            }, {});
          })
          .catch(() => {
            this.activeSuggestionsQueryTerm = null;
            this.suggestions = {};
          })
          .then(() => {
            this.gettingSuggestions = false;
            // If the query has changed in the meantime, go get new suggestions now
            if (query !== this.query) {
              this.getSearchSuggestions(this.query);
            }
          });
      },

      suggestionLinkGen(suggestion) {
        const formattedSuggestion = suggestion ? `"${suggestion.replace(/(^")|("$)/g, '')}"` : undefined;
        return this.linkGen(formattedSuggestion);
      },

      linkGen(queryTerm, path) {
        const query = {
          view: this.view,
          query: queryTerm || ''
        };
        return {
          path: path || this.$path({
            name: 'search'
          }),
          query
        };
      },

      searchInCollectionLinkGen(query) {
        return this.linkGen(query, this.$route.path);
      },

      clearQuery() {
        this.query = '';
        this.suggestions = {};

        this.$nextTick(() => {
          this.$refs.searchinput.$el.focus();
        });
      },

      clickOutside(event) {
        const targetOutsideSearchDropdown = event.target?.id !== 'show-search-button' && this.$refs.searchdropdown && !this.$refs.searchdropdown.contains(event.target);
        if ((event.type === 'click' || event.key === 'Tab') && targetOutsideSearchDropdown) {
          this.showSearchOptions = false;
        }
      },
      toggleSearchBar() {
        this.$store.commit('search/setShowSearchBar', !this.$store.state.search.showSearchBar);
      },

      handleKeyDown(event) {
        this.clickOutside(event);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          this.navigateWithArrowKeys(event);
        }
        if (event.key === 'Escape') {
          this.$refs.searchinput.$el.blur();
          this.showSearchOptions = false;
        }
      },

      navigateWithArrowKeys(event) {
        const searchQueryOptionsComponentOptions = this.$refs.searchoptions?.$refs.options || [];
        const quickSearchComponentOptions = this.$refs.quicksearch?.$refs.options || [];
        const searchDropdownOptions = searchQueryOptionsComponentOptions.concat(quickSearchComponentOptions);
        const activeOption = searchDropdownOptions.map(option => option.$el || option).indexOf(event.target);

        if (searchDropdownOptions.length) {
          if (activeOption === -1) {
            searchDropdownOptions[0].$el ? searchDropdownOptions[0].$el.focus() : searchDropdownOptions[0].focus();
          }
          if (event.key === 'ArrowDown' && activeOption < searchDropdownOptions.length - 1) {
            searchDropdownOptions[activeOption + 1].$el ? searchDropdownOptions[activeOption + 1].$el.focus() : searchDropdownOptions[activeOption + 1].focus();
          }
          if (event.key === 'ArrowUp' && activeOption > 0) {
            searchDropdownOptions[activeOption - 1].$el ? searchDropdownOptions[activeOption - 1].$el.focus() : searchDropdownOptions[activeOption - 1].focus();
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .form-inline {
    align-items: flex-start;
    width: auto;

    .form-control {
      background-color: $white;
    }
  }

  .input-group {
    width: 100%;
    flex-wrap: nowrap;
    height: 3.4rem;
    box-shadow: 2px 2px 4px 0 rgba(0 0 0 / 8%);

    .input-group-prepend {
      display: none;
    }
  }

  .open {
    width: 100%;

    .form-control {
      padding: 0.375rem 1rem 0.375rem 3.5rem;
      height: 3.4rem;
      box-shadow: none;
      border-radius: 0;
      color: $mediumgrey;
      width: 100%;
    }

    .search-query {
      box-shadow: $boxshadow-light;
      width: 100%;
      height: 3.5rem;
      font-size: 1rem;
      color: $mediumgrey;
      display: flex;
      align-items: center;
      position: relative;
      background: $white;

      .search {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 99;
        height: 3.5rem;
        padding: 0.375rem 1rem 0.375rem 3.5rem;
        justify-content: flex-start;

        &:focus {
          color: $black;
          background-color: $offwhite;

          ~ span {
            z-index: 99;
          }
        }

        &::before {
          left: 1rem;
          top: 1rem;
          position: absolute;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .back-button {
    position: absolute;
    left: 1rem;
    top: 1rem;
    z-index: 99;
  }

  .clear-button{
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 99;
  }

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
  }
</style>
