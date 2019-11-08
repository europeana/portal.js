<template>
  <b-form
    ref="form"
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group
      role="combobox"
      aria-owns="autocomplete-results"
      :aria-expanded="isAutoSuggestActive"
      class="auto-suggest"
    >
      <template
        v-if="pillLabel"
        v-slot:prepend
      >
        <SearchBarPill
          :text="pillLabel"
          :remove-link-label="$t('removeFilter', { filterLabel: pillLabel })"
          :remove-link-to="removeLinkTo"
        />
      </template>
      <b-form-input
        ref="searchbox"
        v-model="query"
        :autocomplete="enableAutoSuggest ? 'off' : 'on'"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        role="searchbox"
        aria-autocomplete="list"
        aria-controls="autocomplete-results"
        :aria-label="$t('search')"
        @input="getSearchSuggestions"
      />
      <b-button
        type="submit"
        data-qa="search button"
        variant="primary"
      >
        <span class="sr-only">
          {{ $t('search') }}
        </span>
        <img
          src="../../assets/img/magnifier.svg"
          :alt="$t('search')"
        >
      </b-button>
      <AutoSuggest
        v-if="enableAutoSuggest"
        v-model="suggestions"
        element-id="autocomplete-results"
        :link-gen="suggestionLinkGen"
        :query="currentQuery"
        @select="selectSuggestion"
      />
    </b-input-group>
  </b-form>
</template>

<script>
  import AutoSuggest from './AutoSuggest';
  import SearchBarPill from './SearchBarPill';
  import { getEntitySuggestions, getEntityTypeHumanReadable, getEntitySlug } from '../../plugins/europeana/entity';

  export default {
    name: 'SearchForm',

    components: {
      AutoSuggest,
      SearchBarPill
    },

    props: {
      enableAutoSuggest: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        currentQuery: this.query,
        suggestions: {},
        selectedSuggestion: null
      };
    },

    computed: {
      isAutoSuggestActive() {
        return this.enableAutoSuggest && (this.suggestions.length > 0);
      },

      onSearchablePage() {
        return this.$store.state.search.active;
      },

      pillLabel() {
        return this.$store.state.search.pill;
      },

      query: {
        get() {
          return this.onSearchablePage ? this.$store.state.search.query : '';
        },
        set(value) {
          this.currentQuery = value;
        }
      },

      routePath() {
        if (this.onSearchablePage) {
          return this.$route.path;
        }
        return this.localePath({ name: 'search' });
      },

      removeLinkTo() {
        return {
          path: this.localePath({
            name: 'search'
          }),
          query: { ...this.$route.query, page: 1 }
        };
      },

      view() {
        return this.$store.getters['search/activeView'];
      }
    },

    watch: {
      '$route.query'() {
        this.currentQuery = this.query;
      }
    },

    methods: {
      selectSuggestion(value) {
        this.selectedSuggestion = value;
      },

      async submitForm() {
        let newRoute;

        if (this.selectedSuggestion) {
          newRoute = this.suggestionLinkGen(this.selectedSuggestion);

          // FIXME: selecting a suggestion should then clear the query text, but
          //        none of the below achieve that.
          // this.query = '';
          // this.currentQuery = '';
          // this.$store.commit('search/setQuery', '');
          // this.$refs.searchbox.$el.value = '';
        } else {
          const newRouteQuery = { ...this.$route.query, ...{ query: this.currentQuery, page: 1, view: this.view } };
          newRoute = { path: this.routePath, query: newRouteQuery };
        }

        this.suggestions = {};

        await this.$router.push(newRoute);
      },

      async getSearchSuggestions(query) {
        if (!this.enableAutoSuggest) return;

        if (query === '') {
          this.suggestions = {};
          return;
        }

        // Query in the user's language, and English, removing duplicates
        const languageParam = Array.from(new Set([this.$i18n.locale, 'en'])).join(',');

        const suggestions = await getEntitySuggestions(query, {
          wskey: process.env.EUROPEANA_ENTITY_API_KEY, language: languageParam
        }, {
          recordValidation: Boolean(Number(process.env.ENABLE_ENTITY_SUGGESTION_RECORD_VALIDATION))
        });

        this.suggestions = suggestions.reduce((memo, suggestion) => {
          memo[suggestion.id] = suggestion.prefLabel;
          return memo;
        }, {});
      },

      suggestionLinkGen(entityUri) {
        const entity = {
          id: entityUri,
          prefLabel: this.suggestions[entityUri]
        };
        const uriMatch = entityUri.match('^http://data.europeana.eu/([^/]+)(/base)?/(.+)$');

        return this.localePath({
          name: 'entity-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(entity)
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .input-group {
    width: 100%;

    .input-group-prepend {
      align-items: center;
      background-color: $lightgrey;
      padding-left: .75rem;
      padding-right: .1rem;
      border-radius: 0.375rem 0 0 0.375rem;
    }
  }

  .form-control {
    background-color: $lightgrey;
    border-radius: $border-radius 0 0 $border-radius;
    margin-right: 0;
  }

  .btn {
    border-radius: 0 $border-radius $border-radius 0;

    img {
      display: flex;
    }
  }
</style>
