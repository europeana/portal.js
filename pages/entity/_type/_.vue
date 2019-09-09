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
    <b-row class="flex-column-reverse flex-md-row">
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
        <SearchResults
          :error="searchResults.error"
          :facets="searchResults.facets"
          :last-available-page="searchResults.lastAvailablePage"
          :page="searchResults.page"
          :query="searchResults.query"
          :results="searchResults.results"
          :route="route"
          :selected-facets="searchResults.selectedFacets"
          :show-content-tier-toggle="false"
          :total-results="searchResults.totalResults"
        />
      </b-col>
      <b-col
        cols="12"
        md="3"
        class="pb-3"
      >
        <EntityDetails
          :depiction="depiction"
          :attribution="attribution"
          :description="description"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '../../../components/generic/AlertMessage';
  import BrowseChip from '../../../components/browse/BrowseChip';
  import EntityDetails from '../../../components/browse/EntityDetails';
  import SearchResults from '../../../components/search/SearchResults';

  import * as entities from '../../../plugins/europeana/entity';
  import search, { pageFromQuery, selectedFacetsFromQuery } from '../../../plugins/europeana/search';

  export default {
    components: {
      AlertMessage,
      BrowseChip,
      EntityDetails,
      SearchResults
    },
    data() {
      return {
        entity: null,
        error: null,
        relatedEntities: null,
        searchResults: {
          error: null,
          facets: [],
          lastAvailablePage: false,
          page: 1,
          query: null,
          results: null,
          selectedFacets: {},
          totalResults: null
        }
      };
    },
    computed: {
      attribution() {
        return (!this.entity || !this.entity.depiction) ? null : this.entity.depiction.source;
      },
      depiction() {
        return (!this.entity || !this.entity.depiction) ? null : entities.getWikimediaThumbnailUrl(this.entity.depiction.id);
      },
      description() {
        return entities.getEntityDescription(this.entity);
      },
      route() {
        return {
          name: 'entity-type-all',
          params: {
            type: this.$route.params.type,
            pathMatch: this.$route.params.pathMatch
          }
        };
      },
      title() {
        return !this.entity ? this.$t('entity') : this.entity.prefLabel.en;
      }
    },
    asyncData({ env, query, params, res, redirect, app }) {
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
        // TODO: DRY up (shared with search/index)
        search({
          page: currentPage,
          qf: query.qf,
          query: `"${entities.getEntityUri(params.type, params.pathMatch)}"`,
          reusability: query.reusability,
          theme: query.theme,
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
            entity: entity.entity,
            relatedEntities: related,
            searchResults: { ...searchResults, isLoading: false, page: Number(currentPage), selectedFacets: selectedFacetsFromQuery(query) }
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
    head() {
      return {
        title: this.title
      };
    },
    beforeRouteLeave(to, from, next) {
      this.$root.$emit('leaveSearchPage');
      next();
    },
    // TODO: DRY up (shared with search/index)
    watchQuery: ['page', 'qf', 'query', 'reusability', 'theme']
  };
</script>
