<template>
  <div
    data-qa="entity page"
    class="entity-page"
  >
    <b-container fluid>
      <b-row class="flex-md-row pt-5 bg-white mb-4">
        <b-col
          cols="12"
        >
          <b-container class="mb-5">
            <EntityDetails
              :description="description"
              :is-editorial-description="hasEditorialDescription"
              :title="title"
              :context-label="contextLabel"
              :logo="logo"
              :external-link="homepage"
            />
            <client-only>
              <section
                v-if="isEditable && userIsEditor"
              >
                <div class="d-inline-flex">
                  <b-button
                    variant="outline-primary"
                    @click="$bvModal.show('entityUpdateModal')"
                  >
                    {{ $t('actions.edit') }}
                  </b-button>
                  <EntityUpdateModal
                    :body="entity.proxy"
                    :description="descriptionText"
                  />
                </div>
              </section>
            </client-only>
            <client-only>
              <section
                v-if="relatedCollectionsFound"
                data-qa="related entities"
              >
                <RelatedCollections
                  :title="$t('collectionsYouMightLike')"
                  :related-collections="relatedEntities ? relatedEntities : relatedCollectionCards"
                />
              </section>
            </client-only>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
    <client-only>
      <b-container>
        <b-row>
          <b-col
            cols="12"
            class="pb-3"
          >
            <i18n
              v-if="$route.query.query"
              path="searchResultsForIn"
              tag="h2"
              class="px-0 container"
            >
              <span>{{ $route.query.query }}</span>
              <span>{{ title.values[0] }}</span>
            </i18n>
            <SearchInterface
              class="px-0"
              :per-page="recordsPerPage"
              :route="route"
              :show-content-tier-toggle="false"
              :show-pins="userIsEditor && userIsSetsEditor"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-container class="p-0">
              <BrowseSections
                v-if="page"
                :sections="page.hasPartCollection.items"
              />
            </b-container>
          </b-col>
        </b-row>
      </b-container>
    </client-only>
  </div>
</template>

<script>
  import axios from 'axios';
  import ClientOnly from 'vue-client-only';
  import EntityDetails from '../../../components/entity/EntityDetails';
  import SearchInterface from '../../../components/search/SearchInterface';
  import { mapState } from 'vuex';

  import { BASE_URL as EUROPEANA_DATA_URL } from '../../../plugins/europeana/data';
  import { getEntityTypeHumanReadable, getEntitySlug, getEntityUri } from '../../../plugins/europeana/entity';
  import { langMapValueForLocale, uriRegex } from  '../../../plugins/europeana/utils';

  export default {
    components: {
      BrowseSections: () => import('../../../components/browse/BrowseSections'),
      ClientOnly,
      EntityDetails,
      SearchInterface,
      EntityUpdateModal: () => import('../../../components/entity/EntityUpdateModal'),
      RelatedCollections: () => import('../../../components/generic/RelatedCollections')
    },

    middleware: 'sanitisePageQuery',

    fetch({ query, params, redirect, error, app, store }) {
      store.commit('search/disableCollectionFacet');

      const entityUri = getEntityUri(params.type, params.pathMatch);
      if (entityUri !== store.state.entity.id) {
        // TODO: group as a reset action on the store?
        store.commit('entity/setId', null);
        store.commit('entity/setEntity', null);
        store.commit('entity/setPage', null);
        store.commit('entity/setRelatedEntities', null);
        store.commit('entity/setFeaturedSetId', null);
        store.commit('entity/setPinned', null);
        store.commit('entity/setEditable', false);
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
          .concat(fetchEntity ? app.$apis.entity.getEntity(params.type, params.pathMatch) : () => {})
          .concat(fetchEntity && app.$config.app.features.entityManagement
            && app.$auth.user && app.$auth.user.resource_access.entities
            && app.$auth.user.resource_access.entities.roles.includes('editor') ? app.$apis.entityManagement.getEntity(params.type, params.pathMatch) : () => ({}))
          .concat(fetchFromContentful ? app.$contentful.query('collectionPage', contentfulVariables) : () => {})
      )
        .then(axios.spread((recordSearchResponse, entityResponse, entityManagementResponse, pageResponse) => {
          if (fetchEntity) {
            store.commit('entity/setEntity', entityResponse.entity);
          }
          if (entityManagementResponse.note) {
            store.commit('entity/setEditable', true);
            store.commit('entity/setEntityDescription', entityManagementResponse.note);
            store.commit('entity/setProxy', entityManagementResponse.proxies.find(proxy => proxy.id.includes('#proxy_europeana')));
          }
          if (fetchFromContentful) {
            const pageResponseData = pageResponse.data.data;
            if (fetchCuratedEntities) {
              store.commit('entity/setCuratedEntities', pageResponseData.curatedEntities.items);
            }
            if (fetchEntityPage) {
              store.commit('entity/setPage', pageResponseData.entityPage.items[0]);
            }
          }
          const entity = store.state.entity.entity;
          const page = store.state.entity.page;
          const entityName = page ? page.name : entity.prefLabel.en;
          const desiredPath = getEntitySlug(entity.id, entityName);
          if (params.pathMatch !== desiredPath) {
            const redirectPath = app.$path({
              name: 'collections-type-all',
              params: { type: params.type, pathMatch: encodeURIComponent(desiredPath) }
            });
            return redirect(302, redirectPath);
          }
          return true;
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
      ...mapState({
        entity: state => state.entity.entity,
        page: state => state.entity.page,
        relatedEntities: state => state.entity.relatedEntities,
        recordsPerPage: state => state.entity.recordsPerPage,
        editable: state => state.entity.editable
      }),
      contextLabel() {
        return this.$t(`cardLabels.${this.$route.params.type}`);
      },
      collectionType() {
        return this.$route.params.type;
      },
      logo() {
        if (this.collectionType === 'organisation' && this.entity?.logo) {
          return this.entity.logo.id;
        }
        return null;
      },
      description() {
        if (this.isEditable) {
          return this.entity.note[this.$store.state.i18n.locale] ? { values: this.entity.note[this.$store.state.i18n.locale], code: this.$store.state.i18n.locale } : null;
        }

        const description = this.collectionType === 'organisation' &&
          this.entity?.description ? langMapValueForLocale(this.entity.description, this.$i18n.locale) : null;

        return this.editorialDescription ? { values: [this.editorialDescription], code: null } : description;
      },
      descriptionText() {
        return (this.description && this.description.values.length >= 1) ? this.description.values[0] : null;
      },
      editorialAttribution() {
        return this.page.primaryImageOfPage.url;
      },
      // Description from the Contentful entry
      editorialDescription() {
        if (!this.hasEditorialDescription) {
          return null;
        }
        return this.page.description;
      },
      hasEditorialDescription() {
        return this.page && this.page.description && this.page.description.length >= 1;
      },
      homepage() {
        if (this.collectionType === 'organisation' &&
          this.entity?.homepage &&
          uriRegex.test(this.entity.homepage)) {
          return this.entity.homepage;
        }
        return null;
      },
      // Title from the Contentful entry
      editorialTitle() {
        if (!this.page || !this.page.name) {
          return null;
        }
        return this.page.name;
      },
      relatedCollectionCards() {
        return (this.page
          && this.page.relatedLinksCollection
          && this.page.relatedLinksCollection.items
          && this.page.relatedLinksCollection.items.length > 0)
          ? this.page.relatedLinksCollection.items : null;
      },
      relatedCollectionsFound() {
        if (this.relatedEntities && this.relatedEntities.length > 0) {
          return true;
        } else if (this.relatedCollectionCards && this.relatedCollectionCards.length > 0) {
          return true;
        }
        return false;
      },
      userIsEditor() {
        return this.$store.state.auth.user && this.$store.state.auth.user.resource_access.entities && this.$store.state.auth.user.resource_access.entities.roles.includes('editor');
      },
      userIsSetsEditor() {
        return this.$store.state.auth.user && this.$store.state.auth.user.resource_access.usersets && this.$store.state.auth.user.resource_access.usersets.roles.includes('editor');
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
        if (!this.entity) {
          return this.titleFallback();
        }
        if (this.editorialTitle) {
          return this.titleFallback(this.editorialTitle);
        }
        return langMapValueForLocale(this.entity.prefLabel, this.$store.state.i18n.locale);
      },
      isEditable() {
        return this.entity && this.editable;
      }
    },
    mounted() {
      this.$store.commit('search/setCollectionLabel', this.title.values[0]);
      this.$store.dispatch('entity/searchForRecords', this.$route.query);
      // TODO: move into a new entity store action?
      // Disable related collections for organisation for now
      if (!this.relatedCollectionCards && this.collectionType !== 'organisation') {
        this.$apis.record.relatedEntities(this.$route.params.type, this.$route.params.pathMatch)
          .then(facets => facets ? this.$apis.entity.getEntityFacets(facets, this.$route.params.pathMatch) : [])
          .then(related => {
            this.$store.commit('entity/setRelatedEntities', related);
          });
      }
      if (this.userIsEditor) {
        this.$store.dispatch('entity/getFeatured');
      }
    },
    methods: {
      titleFallback(title) {
        return {
          values: [title],
          code: null
        };
      },
      // TODO: remove this method, as it seems unused on the page
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
        const uriMatch = id.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);
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
        title: this.$pageHeadTitle(this.title.values[0]),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.title.values[0] },
          { hid: 'og:title', property: 'og:title', content: this.title.values[0] }
        ]
          .concat(this.descriptionText ? [
            { hid: 'description', name: 'description', content: this.descriptionText },
            { hid: 'og:description', property: 'og:description', content: this.descriptionText }
          ] : [])
      };
    },
    async beforeRouteLeave(to, from, next) {
      if (to.matched[0].path !== `/${this.$store.state.i18n.locale}/search`) {
        this.$store.commit('search/setShowSearchBar', false);
      }
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
    .related-collections {
      padding: 0;
    }
  }
</style>
