<template>
  <b-container v-if="error">
    <AlertMessage
      :error="error"
    />
  </b-container>
  <b-container
    v-else
    data-qa="entity page"
  >
    <b-row class="flex-md-row pt-3">
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
          :per-row="3"
          :route="route"
          :show-content-tier-toggle="false"
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
    <b-row>
      <b-col>
        <BrowseSections
          v-if="page"
          :sections="page.hasPart"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '../../../components/generic/AlertMessage';
  import BrowseChip from '../../../components/browse/BrowseChip';
  import BrowseSections from '../../../components/browse/BrowseSections';
  import EntityDetails from '../../../components/browse/EntityDetails';
  import SearchInterface from '../../../components/search/SearchInterface';

  import * as entities from '../../../plugins/europeana/entity';
  import { pageFromQuery } from '../../../plugins/europeana/search';
  import createClient from '../../../plugins/contentful';

  const PER_PAGE = 9;

  export default {
    components: {
      AlertMessage,
      BrowseChip,
      BrowseSections,
      EntityDetails,
      SearchInterface
    },
    data() {
      return {
        entity: null,
        error: null,
        page: null,
        relatedEntities: null
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

      // Prevent re-requesting entity content from APIs if already loaded,
      // e.g. when paginating through entity search results
      if (entityUri === store.state.entity.id) return;
      store.commit('entity/setId', entityUri);

      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        query.page = '1';
        return redirect(app.localePath({
          name: 'entity-type-all',
          params: { type: params.type, pathMatch: params.pathMatch },
          query: { page: 1 }
        }));
      }

      const contentfulClient = createClient(query.mode);

      return axios.all([
        entities.getEntity(params.type, params.pathMatch, { wskey: env.EUROPEANA_ENTITY_API_KEY }),
        entities.relatedEntities(params.type, params.pathMatch, {
          wskey: env.EUROPEANA_API_KEY,
          entityKey: env.EUROPEANA_ENTITY_API_KEY
        }),
        contentfulClient.getEntries({
          'locale': app.i18n.isoLocale(),
          'content_type': 'entityPage',
          'fields.identifier': entityUri,
          'include': 2,
          'limit': 1
        })
      ])
        .then(axios.spread((entity, related, entries) => {
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
            page: entityPage,
            relatedEntities: related
          };
        }))
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message };
        });
    },
    async fetch({ store, query, res }) {
      store.commit('search/setActive', true);

      const entityUri = store.state.entity.id;
      const contentTierQuery = 'contentTier:(2 OR 3 OR 4)';

      let hiddenParams = {
        qf: [contentTierQuery]
      };

      if (store.state.entity.themes[entityUri]) {
        hiddenParams.theme = store.state.entity.themes[entityUri];
      } else {
        const entityQuery = entities.getEntityQuery(entityUri);
        hiddenParams.qf.push(entityQuery);
      }

      const apiParams = {
        ...query,
        hidden: hiddenParams,
        rows: PER_PAGE
      };
      await store.dispatch('search/run', apiParams);
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
    },
    head() {
      return {
        title: this.title
      };
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('entity/setId', null);
      this.$store.commit('search/setActive', false);
      next();
    },
    watchQuery: ['page', 'qf', 'query', 'reusability']
  };
</script>
