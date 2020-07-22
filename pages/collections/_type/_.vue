<template>
  <b-container
    data-qa="entity page"
    fluid
    class="entity-page"
  >
    <b-row class="flex-md-row pt-5 bg-white mb-4">
      <b-col
        cols="12"
      >
        <b-container>
          <EntityDetails
            :description="description"
            :is-editorial-description="hasEditorialDescription"
            :title="title"
          />
          <client-only>
            <h2
              v-if="relatedEntities || relatedCollectionCards"
              class="related-heading text-uppercase mb-2"
            >
              {{ $t('collectionsYouMightLike') }}
            </h2>
            <section
              v-if="relatedEntities"
              class="mb-4 mb-lg-2"
              data-qa="related entities"
            >
              <RelatedChip
                v-for="relatedEntity in relatedEntities"
                :id="relatedEntity.id"
                :key="relatedEntity.id"
                :link-to="relatedLinkGen(relatedEntity)"
                :title="relatedEntity.prefLabel[$i18n.locale]"
                :img="`${relatedEntity.isShownBy.thumbnail}&size=w200`"
              />
            </section>
            <section
              v-else-if="relatedCollectionCards"
              class="mb-2"
              data-qa="related entities"
            >
              <RelatedChip
                v-for="(card, index) in relatedCollectionCards"
                :id="card.indentifier"
                :key="index"
                :link-to="relatedLinkGen(card)"
                :title="card.name"
                :img="`${card.image}&size=w200`"
              />
            </section>
          </client-only>
        </b-container>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="pb-3"
      >
        <SearchInterface
          class="px-0"
          :per-page="recordsPerPage"
          :route="route"
          :show-content-tier-toggle="false"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-container class="p-0">
          <client-only>
            <BrowseSections
              v-if="page"
              :sections="page.hasPartCollection.items"
            />
          </client-only>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import ClientOnly from 'vue-client-only';
  import EntityDetails from '../../../components/entity/EntityDetails';
  import SearchInterface from '../../../components/search/SearchInterface';

  import { mapState } from 'vuex';

  import * as entities from '../../../plugins/europeana/entity';
  import { pageFromQuery } from '../../../plugins/utils';
  import { langMapValueForLocale } from  '../../../plugins/europeana/utils';
  import { getEntityTypeHumanReadable, getEntitySlug } from '../../../plugins/europeana/entity';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      BrowseSections: () => import('../../../components/browse/BrowseSections'),
      ClientOnly,
      EntityDetails,
      SearchInterface,
      RelatedChip: () => import('../../../components/generic/RelatedChip')
    },

    fetch({ query, params, redirect, error, app, store }) {
      store.commit('search/disableCollectionFacet');

      const currentPage = pageFromQuery(query.page);
      if (currentPage === null) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.$path({
          name: 'collections-type-all',
          params: { type: params.type, pathMatch: params.pathMatch },
          query: { page: 1 }
        }));
      }

      const entityUri = entities.getEntityUri(params.type, params.pathMatch);

      if (entityUri !== store.state.entity.id) {
        // TODO: group as a reset action on the store?
        store.commit('entity/setId', null);
        store.commit('entity/setEntity', null);
        store.commit('entity/setPage', null);
        store.commit('entity/setRelatedEntities', null);
      }

      store.commit('entity/setId', entityUri);

      // Get all curated entity names & genres and store, unless already stored
      const fetchCuratedEntities = !store.state.entity.curatedEntities;
      // Get the full page for this entity if not known needed, or known to be needed, and store for reuse
      const fetchEntityPage = !store.state.entity.curatedEntities ||
        store.state.entity.curatedEntities.some(entity => entity.identifier === entityUri);
      const fetchFromContentful = fetchCuratedEntities || fetchEntityPage;

      // Prevent re-requesting entity content from APIs if already loaded,
      // e.g. when paginating through entity search results
      const fetchEntity = !store.state.entity.entity;

      const contentfulVariables = {
        identifier: entityUri,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview',
        curatedEntities: fetchCuratedEntities,
        entityPage: fetchEntityPage
      };

      return axios.all(
        [store.dispatch('entity/searchForRecords', query)]
          .concat(fetchEntity ? entities.getEntity(params.type, params.pathMatch) : () => {})
          .concat(fetchFromContentful ? app.$contentful.query('collectionPage', contentfulVariables) : () => {})
      )
        .then(axios.spread((recordSearchResponse, entityResponse, pageResponse) => {
          if (fetchEntity) store.commit('entity/setEntity', entityResponse.entity);

          if (fetchFromContentful) {
            const pageResponseData = pageResponse.data.data;
            if (fetchCuratedEntities) store.commit('entity/setCuratedEntities', pageResponseData.curatedEntities.items);
            if (fetchEntityPage) store.commit('entity/setPage', pageResponseData.entityPage.items[0]);
          }

          const entity = store.state.entity.entity;
          const page = store.state.entity.page;

          const entityName = page ? page.name : entity.prefLabel.en;
          const desiredPath = entities.getEntitySlug(entity.id, entityName);

          if (params.pathMatch !== desiredPath) {
            const redirectPath = app.$path({
              name: 'collections-type-all',
              params: { type: params.type, pathMatch: encodeURIComponent(desiredPath) }
            });
            return redirect(302, redirectPath);
          }
        }))
        .catch((e) => {
          const statusCode = (e.statusCode === undefined) ? 500 : e.statusCode;
          store.commit('entity/setId', null);
          error({ statusCode, message: e.toString() });
        });
    },

    data() {
      return {
        relatedCollections: []
      };
    },

    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      }),
      ...mapState({
        entity: state => state.entity.entity,
        page: state => state.entity.page,
        relatedEntities: state => state.entity.relatedEntities,
        recordsPerPage: state => state.entity.recordsPerPage
      }),
      description() {
        return this.editorialDescription ? { values: [this.editorialDescription], code: null } : null;
      },
      descriptionText() {
        return (this.description && this.description.values.length >= 1) ? this.description.values[0] : null;
      },
      editorialAttribution() {
        return this.page.primaryImageOfPage.url;
      },
      // Depiction from the Contentful entry
      editorialDepiction() {
        try {
          const image = this.page.primaryImageOfPage.image;
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
      relatedCollectionCards() {
        return (this.page
          && this.page.relatedLinksCollection
          && this.page.relatedLinksCollection.items
          && this.page.relatedLinksCollection.items.length > 0)
          ? this.page.relatedLinksCollection.items : null;
      },
      route() {
        return {
          name: 'collections-type-all',
          params: {
            type: this.$route.params.type,
            pathMatch: this.$route.params.pathMatch
          }
        };
      },
      title() {
        if (!this.entity) return this.titleFallback();
        if (this.editorialTitle) return this.titleFallback(this.editorialTitle);
        return langMapValueForLocale(this.entity.prefLabel, this.$store.state.i18n.locale);
      }
    },

    mounted() {
      this.$store.commit('search/setPill', this.title);

      this.$store.dispatch('entity/searchForRecords', this.$route.query);

      // TODO: move into a new entity store action?
      if (!this.relatedCollectionCards) {
        entities.relatedEntities(this.$route.params.type, this.$route.params.pathMatch, { origin: this.$route.query.recordApi })
          .then((related) => {
            this.$store.commit('entity/setRelatedEntities', related);
          });
      }
    },

    methods: {
      titleFallback(title) {
        return {
          values: [title],
          code: null
        };
      },
      relatedLinkGen(item) {
        let id = '';
        let name = '';
        if (typeof item.id === 'undefined') {
          id = item.identifier;
          name = item.name;
        } else {
          id = item.id;
          name = item.prefLabel.en;
        }
        const uriMatch = id.match(`^${this.apiConfig.data.origin}/([^/]+)(/base)?/(.+)$`);
        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(id, name)
          }
        });
      }
    },

    head() {
      return {
        title: this.title.values[0],
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.title.values[0] },
          { hid: 'og:title', property: 'og:title', content: this.title.values[0] }
        ]
          .concat(this.descriptionText ? [
            { hid: 'description', name: 'description', content: this.descriptionText },
            { hid: 'og:description', property: 'og:description', content: this.descriptionText }
          ] : [])
          .concat(this.depiction ? [
            { hid: 'og:image', property: 'og:image', content: this.$options.filters.urlWithProtocol(this.depiction) }
          ] : [])
      };
    },

    async beforeRouteLeave(to, from, next) {
      await this.$store.dispatch('search/deactivate');
      this.$store.commit('entity/setId', null); // needed to re-enable auto-suggest in header
      this.$store.commit('entity/setEntity', null); // needed for best bets handling
      next();
    },

    watchQuery: ['api', 'reusability', 'query', 'qf', 'page']
  };
</script>

<style lang="scss" scoped>
  .entity-page {
    margin-top: -1rem;
    .col-12 > .container {
      padding: 0;
    }
  }
</style>
