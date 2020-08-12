<template>
  <b-form
    ref="form"
    class="open"
    data-qa="search form"
    inline
    autocomplete="off"
    @submit.prevent="submitForm"
  >
    <b-input-group
      role="combobox"
      :aria-owns="enableAutoSuggest ? 'search-form-auto-suggest' : null"
      :aria-expanded="isAutoSuggestActive"
      class="auto-suggest"
    >
      <b-form-input
        ref="searchbox"
        v-model="query"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        role="searchbox"
        aria-autocomplete="list"
        :aria-controls="enableAutoSuggest ? 'search-form-auto-suggest' : null"
        :aria-label="$t('search')"
        @input="getSearchSuggestions"
      />
      <b-button
        v-show="showSearchQuery"
        data-qa="clear button"
        class="clear"
        variant="light"
        :aria-label="$t('header.clearQuery')"
        @click="clearQuery"
      />
      <template
        v-if="pillLabel"
      >
        <div
          v-show="showSearchQuery"
          class="collection search-query"
        >
          <b-button
            type="submit"
            data-qa="search in collection button"
            class="search"
            variant="primary"
            :aria-label="$t('search')"
          >
            <span>{{ $t('header.inCollection', { query: query, collection: pillLabel.values[0] }) }}</span>
          </b-button>
        </div>
        <div
          v-show="showSearchQuery"
          class="search-query"
        >
          <b-button
            data-qa="search entire collection button"
            class="search"
            variant="primary"
            :aria-label="$t('search')"
            @click.prevent="toggleSearchAndRemovePill"
          >
            <span>{{ $t('header.entireCollection', { query: query }) }}</span>
          </b-button>
        </div>
      </template>
      <template
        v-else
      >
        <div
          v-show="showSearchQuery"
          class="search-query"
        >
          <b-button
            type="submit"
            data-qa="search button"
            class="search"
            variant="primary"
            :aria-label="$t('search')"
          >
            <span>{{ $t('header.searchFor', { query: query }) }}</span>
          </b-button>
        </div>
      </template>
      <AutoSuggest
        v-if="enableAutoSuggest"
        v-model="suggestions"
        element-id="search-form-auto-suggest"
        :link-gen="suggestionLinkGen"
        :query="query"
        @select="selectSuggestion"
        @hide-search="hideSearch"
      />
    </b-input-group>
  </b-form>
</template>

<script>
  import AutoSuggest from './AutoSuggest';
  import { getEntitySuggestions } from '../../plugins/europeana/entity';
  import { mapGetters } from 'vuex';
  import match from 'autosuggest-highlight/match';

  export default {
    name: 'SearchForm',

    components: {
      AutoSuggest
    },

    props: {
      enableAutoSuggest: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        query: null,
        showSearchQuery: false,
        gettingSuggestions: false,
        suggestions: {},
        selectedSuggestion: null
      };
    },

    computed: {
      ...mapGetters({
        apiConfig: 'apis/config',
        queryUpdatesForFacetChanges: 'search/queryUpdatesForFacetChanges',
        view: 'search/activeView'
      }),

      isAutoSuggestActive() {
        return this.enableAutoSuggest && (this.suggestions.length > 0);
      },

      onSearchablePage() {
        return this.$store.state.search.active;
      },

      pillLabel() {
        return this.$store.state.search.pill;
      },

      routePath() {
        if (this.onSearchablePage) {
          return this.$route.path;
        }
        return this.$path({ name: 'search' });
      }
    },

    mounted() {
      this.initQuery();
      this.$nextTick(() => {
        this.$refs.searchbox.$el.focus();
      });
    },

    methods: {
      initQuery() {
        this.query = this.$route.query.query;
      },

      selectSuggestion(value) {
        this.selectedSuggestion = value;
      },

      async submitForm() {
        let newRoute;

        if (this.selectedSuggestion) {
          newRoute = this.suggestionLinkGen(this.selectedSuggestion);
        } else {
          const newRouteQuery = { ...this.$route.query, ...{ page: 1, view: this.view, query: this.query || '' } };
          newRoute = { path: this.routePath, query: newRouteQuery };
        }

        this.suggestions = {};
        this.clearQuery();
        this.hideSearch();
        await this.$goto(newRoute);
        this.selectedSuggestion = null;
      },

      getSearchSuggestions(query) {
        if (query === '') {
          this.suggestions = {};
          this.showSearchQuery = false;
          return;
        }

        this.showSearchQuery = true;

        if (!this.enableAutoSuggest) return;

        // Don't go getting more suggestions if we are already waiting for some
        if (this.gettingSuggestions) return;

        const locale = this.$i18n.locale;
        this.gettingSuggestions = true;

        getEntitySuggestions(query, {
          language: locale
        })
          .then(suggestions => {
            this.suggestions = suggestions.reduce((memo, suggestion) => {
              const candidates = [(suggestion.prefLabel || {})[locale]]
                .concat((suggestion.altLabel || {})[locale]);
              memo[suggestion.id] = candidates.find(candidate => match(candidate, query).length > 0);
              return memo;
            }, {});
          })
          .catch(() => {
            this.suggestions = {};
          })
          .then(() => {
            this.gettingSuggestions = false;
            // If the query has changed in the meantime, go get new suggestions now
            if (query !== this.query) this.getSearchSuggestions(this.query);
          });
      },

      suggestionLinkGen(suggestion) {
        const query = {
          view: this.view,
          query: `"${suggestion}"`
        };
        return {
          path: this.$path({
            name: 'search'
          }),
          query
        };
      },

      hideSearch() {
        this.$emit('toggle-search-bar');
      },

      clearQuery() {
        console.log('clearQuery');
        this.query = '';
        this.showSearchQuery = false;
      },

      async toggleSearchAndRemovePill() {
        this.hideSearch();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .form-inline {
    align-items: flex-start;
    width: auto;

    .form-control {
      background-color: $white;
    }

    &.open {
      width: 100%;

      .form-control {
        padding: 0.375rem 3.5rem 0.375rem 3.5rem;
        height: 3.4rem;
        box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.08);
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
            background: $white;
            outline: none;
            color: $black;
            ~ span {
              z-index: 99;
            }
          }

          &:before {
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
  }

  .input-group {
    width: 100%;
    .input-group-prepend {
      display: none;
    }
  }

  .btn {
    align-items: center;
    background: none;
    border-radius: 0;
    border: 0;
    box-shadow: none;
    color: $black;
    display: flex;
    font-size: 1rem;
    height: 1.5rem;
    justify-content: center;
    padding: 0;
    width: 1.5rem;

    &:before {
      @extend .icon-font;
      display: inline-block;
      font-size: 1.1rem;
    }

    &.btn-primary {
      text-transform: none;

      &:hover {
        background: $blue;
        color: $white;
      }
    }

    &.clear {
      position: absolute;
      right: 1rem;
      top: 1rem;
      z-index: 99;

      &:before {
        content: '\e904';
      }
    }
  }
</style>
