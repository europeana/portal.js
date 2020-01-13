<template>
  <b-form
    ref="form"
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group
      role="combobox"
      :aria-owns="enableAutoSuggest ? 'search-form-auto-suggest' : null"
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
          :remove-link-to="pillRemoveLinkTo"
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
        :aria-controls="enableAutoSuggest ? 'search-form-auto-suggest' : null"
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
      </b-button>
      <AutoSuggest
        v-if="enableAutoSuggest"
        v-model="suggestions"
        element-id="search-form-auto-suggest"
        :link-gen="suggestionLinkGen"
        :query="query"
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
      },
      enableSuggestionValidation: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        query: '',
        gettingSuggestions: false,
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

      routePath() {
        if (this.onSearchablePage) {
          return this.$route.path;
        }
        return this.localePath({ name: 'search' });
      },

      pillRemoveLinkTo() {
        return {
          path: this.localePath({
            name: 'search'
          }),
          query: { ...this.$route.query, page: 1, api: undefined }
        };
      },

      view() {
        return this.$store.getters['search/activeView'];
      }
    },

    watch: {
      '$route'() {
        this.initQuery();
      }
    },

    mounted() {
      this.initQuery();
    },

    methods: {
      initQuery() {
        this.query = this.onSearchablePage ? (this.$store.state.search.userParams || {}).query : '';
      },

      selectSuggestion(value) {
        this.selectedSuggestion = value;
      },

      async submitForm() {
        let newRoute;

        if (this.selectedSuggestion) {
          newRoute = this.suggestionLinkGen(this.selectedSuggestion);
        } else {
          const newRouteQuery = { ...this.$route.query, ...{ query: this.query, page: 1, view: this.view } };
          newRoute = { path: this.routePath, query: newRouteQuery };
        }

        this.suggestions = {};

        await this.$router.push(newRoute);
      },

      async getSearchSuggestions(query) {
        if (!this.enableAutoSuggest) return;

        // Don't go getting more suggestions if we are already waiting for some
        if (this.gettingSuggestions) return;

        if (query === '') {
          this.suggestions = {};
          return;
        }

        this.gettingSuggestions = true;

        // Query in the user's language, and English, removing duplicates
        const languageParam = Array.from(new Set([this.$i18n.locale, 'en'])).join(',');

        const suggestions = await getEntitySuggestions(query, {
          wskey: process.env.EUROPEANA_ENTITY_API_KEY, language: languageParam
        }, {
          recordValidation: this.enableSuggestionValidation
        });

        this.suggestions = suggestions.reduce((memo, suggestion) => {
          memo[suggestion.id] = suggestion.prefLabel;
          return memo;
        }, {});

        this.gettingSuggestions = false;

        // If the query has changed in the meantime, go get new suggestions now
        if (query !== this.query) this.getSearchSuggestions(this.query);
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
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .input-group {
    width: 100%;

    .input-group-prepend {
      align-items: center;
      background-color: $offwhite;
      padding-left: 0.75rem;
      padding-right: 0.1rem;
      border-radius: $border-radius 0 0 $border-radius;
    }
  }

  .form-control {
    background-color: $offwhite;
    border-radius: $border-radius 0 0 $border-radius;
    margin-right: 0;
  }

  .btn {
    border-radius: 0 $border-radius $border-radius 0;

    &:before {
      @extend .icon-font;
      content: '\e92b';
      display: inline-block;
      transform: scaleX(-1);
    }
  }
</style>
