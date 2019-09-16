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
    <b-row class="flex-md-row">
      <b-col
        cols="12"
        md="9"
      >
        <EntityDetails
          :attribution="attribution"
          :depiction="depiction"
          :description="description"
          :title="title"
        />
        <SearchResults
          :error="searchResults.error"
          :facets="searchResults.facets"
          :last-available-page="searchResults.lastAvailablePage"
          :page="searchResults.page"
          :exclude-from-route-query="['query']"
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
        <ul
          v-if="relatedEntities"
          class="list-unstyled"
        >
          <BrowseChip
            v-for="relatedEntity in relatedEntities"
            :key="relatedEntity.path"
            :link-to="localePath({
              name: 'entity-type-all',
              params: {
                type: relatedEntity.type,
                pathMatch: relatedEntity.path
              }
            })"
            :title="relatedEntity.title"
          />
        </ul>
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
          results: [],
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
      const entityQuery = `"${entities.getEntityUri(params.type, params.pathMatch)}"`;

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
          query: entityQuery,
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
            searchResults: {
              ...searchResults,
              page: Number(currentPage),
              query: entityQuery,
              selectedFacets: selectedFacetsFromQuery(query)
            }
          };
        }))
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message };
        });
    },
    head() {
      return {
        title: this.title
      };
    },
    beforeRouteLeave(to, from, next) {
      if (to.path !== '/search') {
        this.$root.$emit('leaveSearchPage');
      }
      next();
    }
  };
</script>
