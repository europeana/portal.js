<template>
  <b-container
    v-if="error"
    class="mb-3"
  >
    <AlertMessage
      :error="error"
    />
  </b-container>
  <b-container
    v-else
    data-qa="entity page"
  >
    <b-row>
      <b-col>
        <h1 data-qa="entity title">
          {{ title }}
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        md="9"
      >
        <BrowseChip
          v-for="relatedEntity in relatedEntities"
          :key="relatedEntity.path"
          :path="relatedEntity.path"
          :type="relatedEntity.type"
          :title="relatedEntity.title"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        md="9"
      >
        <p
          v-if="searchResults.results.length == 0"
          data-qa="warning notice"
        >
          {{ $t('noMoreResults') }}
        </p>
        <SearchResultsList
          v-else
          :results="searchResults.results"
        />
        <InfoMessage
          v-if="searchResults.lastAvailablePage"
          message="Additional results are not shown as only the first 1000 most relevant results are shown. If you haven't found what you're looking for, please consider refining your search."
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PaginationNav
          v-if="searchResults.totalResults > perPage"
          v-model="searchResults.page"
          :total-results="searchResults.totalResults"
          :per-page="perPage"
          :link-gen="paginationLink"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '../../../components/generic/AlertMessage';
  import InfoMessage from '../../../components/generic/InfoMessage';
  import BrowseChip from '../../../components/browse/BrowseChip';
  import SearchResultsList from '../../../components/search/SearchResultsList';
  import PaginationNav from '../../../components/generic/PaginationNav';

  import * as entities from '../../../plugins/europeana/entity';
  import search, { pageFromQuery } from '../../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      InfoMessage,
      BrowseChip,
      SearchResultsList,
      PaginationNav
    },
    props: {
      perPage: {
        type: Number,
        default: 24
      }
    },
    data () {
      return {
        error: null,
        title: null,
        entity: null,
        relatedEntities: null,
        searchResults: {
          error: null,
          errorNoResults: 'No results',
          results: null,
          totalResults: null,
          lastAvailablePage: false,
          query: null,
          page: 1
        }
      };
    },
    computed: {
      hasResults: function () {
        return this.searchResults.results !== null && this.searchResults.totalResults > 0;
      }
    },
    asyncData ({ env, query, params, res, redirect, app }) {
      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({
          name: 'entity-type-all',
          params: { type: params.type, pathMatch: params.pathMatch },
          query: { page: 1 }
        }));
      }
      return axios.all([
        entities.getEntity(params.type, params.pathMatch, { wskey: env.EUROPEANA_ENTITY_API_KEY }),
        entities.relatedEntities(params.type, params.pathMatch, {
          wskey: env.EUROPEANA_API_KEY,
          entityKey: env.EUROPEANA_ENTITY_API_KEY
        }),
        search({
          page: currentPage,
          query: `"${entities.getEntityUri(params.type, params.pathMatch)}"`,
          wskey: env.EUROPEANA_API_KEY
        })
      ])
        .then(axios.spread((entity, related, searchResults) => {
          const desiredPath = entities.getEntitySlug(entity.entity);

          if (params.pathMatch !== desiredPath) {
            const redirectPath = app.localePath({
              name: 'entity-type-all',
              params: { type: params.type, pathMatch: encodeURIComponent(desiredPath) }
            });
            return redirect(302, redirectPath);
          }

          return {
            error: null,
            title: entity.entity.prefLabel.en,
            entity: entity.entity,
            relatedEntities: related,
            searchResults: { ...searchResults, isLoading: false, page: Number(currentPage) }
          };
        }))
        .catch((err) => {
          let errorMessage = err.message;
          if (typeof res !== 'undefined') {
            res.statusCode = err.message.startsWith('No resource found with ID:') ? 404 : 500;
            if (err.message.startsWith('Invalid query')) {
              res.statusCode = 400;
            } else {
              const paginationError = err.message.match(/It is not possible to paginate beyond the first (\d+)/);
              if (paginationError !== null) {
                res.statusCode = 400;
                errorMessage = `It is only possible to view the first ${paginationError[1]} search results.`;
              } else {
                res.statusCode = 500;
              }
            }
          }
          return { error: errorMessage };
        });
    },
    methods: {
      paginationLink (val) {
        return this.localePath({
          name: 'entity-type-all', params: { type: entities.getEntityTypeHumanReadable(this.entity.type), pathMatch: entities.getEntitySlug(this.entity) }, query: { page: val }
        });
      }
    },
    head () {
      return {
        title: this.$t('entity')
      };
    },
    watchQuery: ['page']
  };
</script>
