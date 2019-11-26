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
          :depiction-link-title="depictionLinkTitle"
        />
        <SearchInterface
          class="px-0"
          :per-row="3"
          :per-page="perPage"
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
  import EntityDetails from '../../../components/entity/EntityDetails';
  import SearchInterface from '../../../components/search/SearchInterface';

  import * as entities from '../../../plugins/europeana/entity';
  import { pageFromQuery } from '../../../plugins/utils';
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
    async middleware({ store, query }) {
      const contentfulClient = createClient(query.mode);

      // fetch all curated entity pages
      if (!store.state.entity.curatedEntities) {
        await contentfulClient.getEntries({
          'locale': 'en-GB',
          'content_type': 'entityPage',
          'include': 0,
          'limit': 1000 // 1000 is the maximum number of results returned by contentful
        }).then(async(response) => {
          await store.commit('entity/setCuratedEntities', response.items.map(entityPage => entityPage.fields.identifier));
        }).catch(async() => {
          await store.commit('entity/setCuratedEntities', []);
        });
      }
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
        if (this.editorialDepiction) return this.editorialAttribution;
        return (!this.entity || !this.entity.depiction) ? null : this.entity.depiction.source;
      },
      depiction() {
        if (this.editorialDepiction) return this.editorialDepiction;
        return (!this.entity || !this.entity.depiction) ? null : entities.getWikimediaThumbnailUrl(this.entity.depiction.id);
      },
      depictionLinkTitle() {
        return this.editorialDepiction ? this.$t('goToRecord') : this.$t('entityDepictionCredit');
      },
      description() {
        return this.editorialDescription ? this.editorialDescription : entities.getEntityDescription(this.entity);
      },
      editorialAttribution() {
        return this.page.primaryImageOfPage.fields.url;
      },
      // Depiction from the Contentful entry
      editorialDepiction() {
        try {
          const image = this.page.primaryImageOfPage.fields.image.fields.file;
          return this.$options.filters.optimisedImageUrl(image.url, image.contentType, { width: 255 });
        } catch (error) {
          if (error instanceof TypeError) {
            return null;
          }
          throw error;
        }
      },
      // Description from the Contentful entry
      editorialDescription() {
        if (!this.page || !this.page.description) return null;
        return this.page.description;
      },
      // Title from the Contentful entry
      editorialTitle() {
        if (!this.page || !this.page.name) return null;
        return this.page.name;
      },
      perPage() {
        return PER_PAGE;
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
        if (!this.entity) return this.$t('entity');
        if (this.editorialTitle) return this.editorialTitle;
        return this.entity.prefLabel[this.$store.state.i18n.locale];
      }
    },

    asyncData({ env, query, params, res, redirect, app, store }) {
      const currentPage = pageFromQuery(query.page);
      const entityUri = entities.getEntityUri(params.type, params.pathMatch);

      // Prevent re-requesting entity content from APIs if already loaded,
      // e.g. when paginating through entity search results
      if (entityUri === store.state.entity.id) {
        return {
          entity: store.state.entity.entity,
          page: store.state.entity.page,
          relatedEntities: store.state.entity.relatedEntities
        };
      }
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
        })
      ].concat(!store.state.entity.curatedEntities.includes(entityUri) ? [] : contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'entityPage',
        'fields.identifier': entityUri,
        'include': 2,
        'limit': 1
      })
      // URL slug is always derived from English, so if viewing in another locale,
      // we also need to get the English, solely for the URL slug from `name`.
      ).concat(app.i18n.locale === 'en' || !store.state.entity.curatedEntities.includes(entityUri) ? [] : contentfulClient.getEntries({
        'locale': 'en-GB',
        'content_type': 'entityPage',
        'fields.identifier': entityUri,
        'include': 2,
        'limit': 1
      })))
        .then(axios.spread((entity, related, localisedEntries, defaultLocaleEntries) => {
          const localisedEntityPage = localisedEntries && localisedEntries.total > 0 ? localisedEntries.items[0].fields : null;
          const defaultEntityPage = defaultLocaleEntries && defaultLocaleEntries.total > 0 ? defaultLocaleEntries.items[0].fields : null;
          const desiredPath = entities.getEntitySlug(entity.entity, defaultEntityPage || localisedEntityPage);

          // Store content for reuse should a redirect be needed, below, or when
          // navigating back to this page, e.g. from a search result.
          store.commit('entity/setEntity', entity.entity);
          store.commit('entity/setPage', localisedEntityPage);
          store.commit('entity/setRelatedEntities', related);

          if (params.pathMatch !== desiredPath) {
            const redirectPath = app.localePath({
              name: 'entity-type-all',
              params: { type: params.type, pathMatch: encodeURIComponent(desiredPath) }
            });
            return redirect(302, redirectPath);
          }

          return {
            entity: entity.entity,
            page: localisedEntityPage,
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

    mounted() {
      this.$store.commit('search/setPill', this.title);
    },

    head() {
      return {
        title: this.title,
        meta: [
          { hid: 'title', name: 'title', content: this.title },
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:title', property: 'og:title', content: this.title },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ]
      };
    },

    beforeRouteLeave(to, from, next) {
      this.$store.commit('search/setActive', false);
      this.$store.commit('entity/setId', null); // needed to re-enable auto-suggest in header
      this.$store.commit('search/setPill', null);
      next();
    },

    watchQuery: ['page', 'qf', 'query', 'reusability']
  };
</script>
