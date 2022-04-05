<template>
  <div
    data-qa="entity page"
    class="entity-page"
  >
    <b-container
      v-if="$fetchState.error"
    >
      <b-row
        class="flex-md-row py-4"
      >
        <b-col cols="12">
          <AlertMessage
            :error="$fetchState.error.message"
          />
        </b-col>
      </b-row>
    </b-container>
    <client-only v-else>
      <b-container
        class="page-container side-filters-enabled"
      >
        <b-row class="flex-nowrap">
          <b-col>
            <b-container class="px-0 pb-3">
              <SearchInterface
                v-if="!$fetchState.pending"
                class="px-0"
                :per-page="recordsPerPage"
                :route="route"
                :show-content-tier-toggle="false"
                :show-pins="userIsEditor && userIsSetsEditor"
                :editorial-entity-label="editorialTitle"
                :show-related="showRelated"
              >
                <EntityHeader
                  v-if="!hasUserQuery"
                  :description="description"
                  :title="title"
                  :logo="logo"
                  :image="thumbnail"
                  :editable="isEditable && userIsEditor"
                  :external-link="homepage"
                  :proxy="entity ? entity.proxy : null"
                  :more-info="moreInfo"
                />
                <template
                  #related
                >
                  <client-only>
                    <RelatedCollections
                      :title="$t('youMightAlsoLike')"
                      :related-collections="relatedCollections"
                      data-qa="related entities"
                      @show="showRelatedCollections"
                      @hide="hideRelatedCollections"
                    />
                  </client-only>
                </template>
              </SearchInterface>
            </b-container>
            <b-container class="px-0">
              <BrowseSections
                v-if="page"
                :sections="page.hasPartCollection.items"
              />
            </b-container>
          </b-col>
          <SideFilters
            :route="route"
          />
        </b-row>
      </b-container>
    </client-only>
  </div>
</template>

<script>
  import pick from 'lodash/pick';
  import ClientOnly from 'vue-client-only';
  import SearchInterface from '@/components/search/SearchInterface';
  import { mapState } from 'vuex';

  import themes from '@/plugins/europeana/themes';
  import {
    getEntitySlug, getEntityUri, getEntityQuery, normalizeEntityId
  } from '@/plugins/europeana/entity';
  import { langMapValueForLocale, uriRegex } from  '@/plugins/europeana/utils';

  export default {
    name: 'CollectionPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BrowseSections: () => import('@/components/browse/BrowseSections'),
      ClientOnly,
      SearchInterface,
      SideFilters: () => import('@/components/search/SideFilters'),
      EntityHeader: () => import('@/components/entity/EntityHeader'),
      RelatedCollections: () => import('@/components/generic/RelatedCollections')
    },

    beforeRouteLeave(to, from, next) {
      if (to.matched[0].path !== `/${this.$i18n.locale}/search`) {
        this.$store.commit('search/setShowSearchBar', false);
      }
      this.$store.commit('entity/setId', null); // needed to re-enable auto-suggest in header
      this.$store.commit('entity/setEntity', null); // needed for best bets handling
      next();
    },

    middleware: 'sanitisePageQuery',

    data() {
      return {
        page: null,
        relatedEntities: null,
        showRelated: false,
        themes: themes.map(theme => theme.id)
      };
    },

    fetch() {
      this.$store.commit('search/disableCollectionFacet');

      const entityUri = getEntityUri(this.$route.params.type, this.$route.params.pathMatch);
      if (entityUri !== this.$store.state.entity.id) {
        // TODO: group as a reset action on the store?
        this.$store.commit('entity/setId', null);
        this.$store.commit('entity/setEntity', null);
        this.$store.commit('entity/setFeaturedSetId', null);
        this.$store.commit('entity/setPinned', null);
        this.$store.commit('entity/setEditable', false);
        this.page = null;
      }
      this.$store.commit('entity/setId', entityUri);

      // Fetch entity management data if feature enabled and user has required access
      const fetchEntityManagement = this.$features.entityManagement &&
        this.$auth.user?.resource_access?.entities?.roles.includes('editor');
      // Get the full page for this entity if not known needed, or known to be needed, and store for reuse
      const fetchEntityPage = !this.$store.state.entity.curatedEntities ||
        this.$store.state.entity.curatedEntities.some(entity => entity.identifier === entityUri);

      const contentfulVariables = {
        identifier: entityUri,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };

      return Promise.all([
        this.$apis.entity.get(this.$route.params.type, this.$route.params.pathMatch),
        fetchEntityManagement ? this.$apis.entityManagement.get(this.$route.params.type, this.$route.params.pathMatch) : () => null,
        fetchEntityPage ? this.$contentful.query('collectionPage', contentfulVariables) : () => null
      ])
        .then(responses => {
          this.$store.commit('entity/setEntity', pick(responses[0].entity, [
            'id', 'logo', 'note', 'description', 'homepage', 'prefLabel', 'isShownBy', 'hasAddress', 'acronym'
          ]));
          if (responses[1].note) {
            this.$store.commit('entity/setEditable', true);
            this.$store.commit('entity/setEntityDescription', responses[1].note);
            this.$store.commit('entity/setProxy', responses[1].proxies.find(proxy => proxy.id.includes('#proxy_europeana')));
          }
          if (fetchEntityPage) {
            const pageResponseData = responses[2].data.data;
            this.page = pageResponseData.entityPage.items[0];
            this.$store.commit('entity/setCuratedEntities', pageResponseData.curatedEntities.items);
          }
          const entity = this.$store.state.entity.entity;
          const entityName = this.page ? this.page.name : entity.prefLabel.en;
          const desiredPath = getEntitySlug(entity.id, entityName);
          if (this.$route.params.pathMatch !== desiredPath) {
            const redirectPath = this.$path({
              name: 'collections-type-all',
              params: { type: this.$route.params.type, pathMatch: desiredPath }
            });
            return this.$nuxt.context.redirect(302, redirectPath);
          }
          return true;
        });
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.pageTitle),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.pageTitle },
          { hid: 'og:title', property: 'og:title', content: this.pageTitle }
        ]
          .concat(this.descriptionText ? [
            { hid: 'description', name: 'description', content: this.descriptionText },
            { hid: 'og:description', property: 'og:description', content: this.descriptionText }
          ] : [])
      };
    },

    computed: {
      ...mapState({
        entity: state => state.entity.entity,
        recordsPerPage: state => state.entity.recordsPerPage,
        editable: state => state.entity.editable
      }),
      pageTitle() {
        return this.$fetchState.error ? this.$t('error') : this.title.values[0];
      },
      searchOverrides() {
        const overrideParams = {
          qf: [],
          rows: this.recordsPerPage
        };

        if (this.entity) {
          const curatedEntity = this.$store.getters['entity/curatedEntity'](this.entity.id);
          if (curatedEntity && curatedEntity.genre) {
            overrideParams.qf.push(`collection:${curatedEntity.genre}`);
          } else {
            const entityQuery = getEntityQuery(this.entity.id);
            overrideParams.qf.push(entityQuery);
            if (!this.$route.query.query) {
              overrideParams.query = entityQuery; // Triggering best bets.
            }
          }
        }

        return overrideParams;
      },
      entityId() {
        return normalizeEntityId(this.$route.params.pathMatch);
      },
      contextLabel() {
        let contextType = this.collectionType;

        if (this.collectionType === 'topic' && this.themes.includes(this.entityId)) {
          contextType = 'theme';
        }

        return this.$t(`cardLabels.${contextType}`);
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
          return this.entity.note[this.$i18n.locale] ? { values: this.entity.note[this.$i18n.locale], code: this.$i18n.locale } : null;
        }

        let description = null;
        if (this.collectionType === 'organisation' && this.entity?.description) {
          description = langMapValueForLocale(this.entity.description, this.$i18n.locale);
        }

        return this.editorialDescription ? { values: [this.editorialDescription], code: null } : description;
      },
      descriptionText() {
        return ((this.description?.values?.length || 0) >= 1) ? this.description.values[0] : null;
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
        return (this.page?.description?.length || 0) >= 1;
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
        return this.page?.name || null;
      },
      relatedCollectionCards() {
        return ((this.page?.relatedLinksCollection?.items?.length || 0) > 0) ? this.page.relatedLinksCollection.items : null;
      },
      relatedCollections() {
        return this.relatedEntities || this.relatedCollectionCards || [];
      },
      relatedCollectionsFound() {
        return this.relatedCollections.length > 0;
      },
      userIsEditor() {
        return this.$store.state.auth.user?.resource_access?.entities?.roles?.includes('editor') || false;
      },
      userIsSetsEditor() {
        return this.$store.state.auth.user?.resource_access?.usersets?.roles.includes('editor') || false;
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
        return langMapValueForLocale(this.entity.prefLabel, this.$i18n.locale);
      },
      isEditable() {
        return this.entity && this.editable;
      },
      hasUserQuery() {
        return this.$route.query.query &&  this.$route.query.query !== '';
      },
      thumbnail() {
        return this.entity?.isShownBy?.thumbnail || null;
      },
      moreInfo() {
        const labelledMoreInfo = [];

        if (this.collectionType === 'organisation') {
          if (this.homepage)  {
            labelledMoreInfo.push({ label: this.$t('website'), value: this.homepage });
          }
          if (this.entity?.hasAddress?.countryName)  {
            labelledMoreInfo.push({ label: this.$t('organisation.country'), value: this.entity.hasAddress.countryName });
          }
          if (this.entity?.acronym)  {
            const langMapValue = langMapValueForLocale(this.entity.acronym, this.$i18n.locale);
            labelledMoreInfo.push({ label: this.$t('organisation.nameAcronym'), value: langMapValue.values[0], lang: langMapValue.code });
          }
          if (this.entity?.hasAddress?.locality)  {
            labelledMoreInfo.push({ label: this.$t('organisation.city'), value: this.entity.hasAddress.locality });
          }
        }

        return labelledMoreInfo.length > 0 ? labelledMoreInfo : null;
      }
    },
    watch: {
      searchOverrides: 'storeSearchOverrides'
    },
    mounted() {
      this.$store.commit('search/setCollectionLabel', this.pageTitle);
      this.storeSearchOverrides();
      // Disable related collections for organisation (for now)
      if (!this.relatedCollectionCards && this.collectionType !== 'organisation') {
        this.$apis.record.relatedEntities(this.$route.params.type, this.$route.params.pathMatch)
          .then(facets => facets ? this.$apis.entity.facets(facets, this.$route.params.pathMatch) : [])
          .then(related => this.relatedEntities = related.map(entity => {
            return pick(entity, ['id', 'prefLabel', 'isShownBy']);
          }));
      }
      if (this.userIsEditor) {
        this.$store.dispatch('entity/getFeatured');
      }
    },
    methods: {
      storeSearchOverrides() {
        this.$store.commit('search/set', ['overrideParams', this.searchOverrides]);
      },
      titleFallback(title) {
        return {
          values: [title],
          code: null
        };
      },
      showRelatedCollections() {
        this.showRelated = true;
      },
      hideRelatedCollections() {
        this.showRelated = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .entity-page {
    &.top-header {
      margin-top: -1rem;
    }

    .related-collections {
      padding: 0;
    }

    ::v-deep .related-collections .badge {
      // TODO: Remove this when the badges move into the search results
      margin-top: 0.25rem;
      margin-right: 0.5rem;
    }
  }

  .page-container {
    max-width: none;
  }
</style>
