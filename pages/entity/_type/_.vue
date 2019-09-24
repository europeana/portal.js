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
        <SearchInterface
          class="px-0"
          :error="search.error"
          :exclude-from-route-query="['query']"
          :facets="search.facets"
          :hidden-search-params="hiddenSearchParams"
          :last-available-page="search.lastAvailablePage"
          :per-page="search.perPage"
          :per-row="3"
          :query="search.query"
          :results="search.results"
          :route="route"
          :selected-facets="search.selectedFacets"
          :show-content-tier-toggle="false"
          :total-results="search.totalResults"
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
  import SearchInterface from '../../../components/search/SearchInterface';

  import * as entities from '../../../plugins/europeana/entity';
  import search, { pageFromQuery, selectedFacetsFromQuery } from '../../../plugins/europeana/search';
  import { createClient } from '../../../plugins/contentful.js';

  const PER_PAGE = 9;

  export default {
    components: {
      AlertMessage,
      BrowseChip,
      EntityDetails,
      SearchInterface
    },
    data() {
      return {
        entity: null,
        error: null,
        hiddenSearchParams: {},
        relatedEntities: null,
        search: {
          error: null,
          facets: [],
          lastAvailablePage: false,
          perPage: PER_PAGE,
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
    asyncData({ env, query, params, res, redirect, app, store }) {
      const currentPage = pageFromQuery(query.page);
      const entityUri = entities.getEntityUri(params.type, params.pathMatch);
      const entityQuery = entities.getEntityQuery(entityUri);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({
          name: 'entity-type-all',
          params: { type: params.type, pathMatch: params.pathMatch },
          query: { page: 1 }
        }));
      }

      store.commit('search/setPage', currentPage);

      const hiddenSearchParams = {
        qf: [entityQuery]
      };
      const contentfulClient = createClient(query.mode);

      return axios.all([
        entities.getEntity(params.type, params.pathMatch, { wskey: env.EUROPEANA_ENTITY_API_KEY }),
        entities.relatedEntities(params.type, params.pathMatch, {
          wskey: env.EUROPEANA_API_KEY,
          entityKey: env.EUROPEANA_ENTITY_API_KEY
        }),
        // TODO: DRY up (shared with search/index)
        search({
          page: currentPage,
          qf: hiddenSearchParams.qf.concat(query.qf),
          query: query.query,
          reusability: query.reusability,
          rows: PER_PAGE,
          wskey: env.EUROPEANA_API_KEY
        }),
        contentfulClient.getEntries({
          'locale': app.i18n.isoLocale(),
          'content_type': 'entityPage',
          'fields.identifier': entityUri,
          'include': 2,
          'limit': 1
        })
      ])
        .then(axios.spread((entity, related, search, entries) => {
          const desiredPath = entities.getEntitySlug(entity.entity);

          if (params.pathMatch !== desiredPath) {
            const redirectPath = app.localePath({
              name: 'entity-type-all',
              params: { type: params.type, pathMatch: encodeURIComponent(desiredPath) }
            });
            return redirect(302, redirectPath);
          }

          const entityPage = entries.total > 0 ? entries.items[0].fields : null;

          return {
            entity: entity.entity,
            hiddenSearchParams,
            page: entityPage,
            relatedEntities: related,
            search: {
              ...search,
              perPage: PER_PAGE,
              query: query.query,
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
    fetch({ store, query }) {
      store.commit('search/setQuery', query.query);
      store.commit('search/setActive', true);
    },
    head() {
      return {
        title: this.title
      };
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('search/setActive', false);
      next();
    }
  };
</script>
