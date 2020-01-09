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
          :is-editorial-description="hasEditorialDescription"
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
  import { langMapValueForLocale } from  '../../../plugins/europeana/utils';

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
        return this.editorialDescription ? { values: [this.editorialDescription], code: null } : entities.getEntityDescription(this.entity, this.$i18n.locale);
      },
      descriptionText() {
        return (this.description && this.description.values.length >= 1) ? this.description.values[0] : null;
      },
      editorialAttribution() {
        return this.page.primaryImageOfPage.fields.url;
      },
      // Depiction from the Contentful entry
      editorialDepiction() {
        try {
          const image = this.page.primaryImageOfPage.fields.image.fields.file;
          return this.$options.filters.optimisedImageUrl(image.url, image.contentType, { width: 510 });
        } catch (error) {
          if (error instanceof TypeError) {
            return null;
          }
          throw error;
        }
      },
      // Description from the Contentful entry
      editorialDescription() {
        if (!this.hasEditorialDescription) return null;
        return this.page.description;
      },
      hasEditorialDescription() {
        return this.page && this.page.description && this.page.description.length >= 1;
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
        if (!this.entity) return this.titleFallback(this.$t('entity'));
        if (this.editorialTitle) return this.titleFallback(this.editorialTitle);
        return langMapValueForLocale(this.entity.prefLabel, this.$store.state.i18n.locale);
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
      await store.dispatch('search/activate');
      store.commit('search/setUserParams', query);

      // TODO: consider moving the logic here into the store as mutations/actions
      const entityUri = store.state.entity.id;
      const contentTierQuery = 'contentTier:(2 OR 3 OR 4)';

      const overrideParams = {
        qf: [contentTierQuery],
        rows: PER_PAGE
      };

      if (store.state.entity.themes[entityUri]) {
        overrideParams.theme = store.state.entity.themes[entityUri];
      } else {
        const entityQuery = entities.getEntityQuery(entityUri);
        overrideParams.qf.push(entityQuery);
      }

      store.commit('search/setUserParams', query);
      store.commit('search/setOverrideParams', overrideParams);

      await store.dispatch('search/run');
      if (store.state.search.error && typeof res !== 'undefined') {
        res.statusCode = store.state.search.errorStatusCode;
      }
    },

    mounted() {
      this.$store.commit('search/setPill', this.title);
      this.$store.commit('search/disableThemeFacet');
    },

    methods: {
      titleFallback(title) {
        return {
          values: [title],
          code: null
        };
      }
    },

    head() {
      return {
        title: this.title.values[0],
        meta: [
          { hid: 'title', name: 'title', content: this.title.values[0] },
          { hid: 'og:title', property: 'og:title', content: this.title.values[0] }
        ].concat(this.descriptionText ? [
          { hid: 'description', name: 'description', content: this.descriptionText },
          { hid: 'og:description', property: 'og:description', content: this.descriptionText }
        ] : [])
      };
    },

    async beforeRouteLeave(to, from, next) {
      await this.$store.dispatch('search/deactivate');
      this.$store.commit('entity/setId', null); // needed to re-enable auto-suggest in header
      next();
    },

    watchQuery: ['page', 'qf', 'query', 'reusability']
  };
</script>
