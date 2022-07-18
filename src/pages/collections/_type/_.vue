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
      <SearchInterface
        v-if="!$fetchState.pending"
        :per-page="recordsPerPage"
        :route="route"
        :show-content-tier-toggle="false"
        :show-pins="userIsEntitiesEditor && userIsSetsEditor"
        :editorial-overrides="editorialOverrides"
        :show-related="showRelated"
      >
        <EntityHeader
          v-show="entity && !hasUserQuery"
          :id="entity && entity.id"
          :description="description"
          :title="title"
          :sub-title="subTitle"
          :logo="logo"
          :image="thumbnail"
          :editable="editable"
          :external-link="homepage"
          :proxy="proxy"
          :more-info="moreInfo"
          @updated="proxyUpdated"
        />
        <template
          v-if="collectionType !== 'organisation'"
          #related
        >
          <client-only>
            <EntityRelatedCollections
              :type="$route.params.type"
              :identifier="$route.params.pathMatch"
              :overrides="relatedCollectionCards"
              data-qa="related entities"
              @show="showRelatedCollections"
              @hide="hideRelatedCollections"
            />
          </client-only>
        </template>
        <template
          #after-results
        >
          <client-only>
            <b-container class="px-0">
              <RelatedEditorial
                v-if="entity"
                :entity-uri="entity.id"
                :query="$route.query.query"
              />
              <BrowseSections
                v-if="page"
                :sections="page.hasPartCollection.items"
              />
            </b-container>
          </client-only>
        </template>
      </SearchInterface>
    </client-only>
  </div>
</template>

<script>
  import pick from 'lodash/pick';
  import ClientOnly from 'vue-client-only';
  import SearchInterface from '@/components/search/SearchInterface';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

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
      EntityHeader: () => import('@/components/entity/EntityHeader'),
      EntityRelatedCollections: () => import('@/components/entity/EntityRelatedCollections'),
      RelatedEditorial: () => import('@/components/related/RelatedEditorial'),
      SearchInterface
    },

    mixins: [
      europeanaEntitiesOrganizationsMixin
    ],

    beforeRouteLeave(to, from, next) {
      if (to.matched[0].path !== `/${this.$i18n.locale}/search`) {
        this.$store.commit('search/setShowSearchBar', false);
      }
      this.$store.commit('entity/setId', null); // needed to re-enable auto-suggest in header
      this.$store.commit('entity/setEntity', null); // needed for best bets handling
      this.$store.commit('entity/setFeaturedSetId', null);
      this.$store.commit('entity/setPinned', []);
      next();
    },

    middleware: 'sanitisePageQuery',

    data() {
      return {
        page: null,
        proxy: null,
        showRelated: false,
        themes: themes.map(theme => theme.id)
      };
    },

    fetch() {
      this.$store.commit('search/disableCollectionFacet');

      const entityUri = getEntityUri(this.collectionType, this.$route.params.pathMatch);
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

      // Get the full page for this entity if not known needed, or known to be needed, and store for reuse
      const fetchEntityPage = !this.$store.state.entity.curatedEntities ||
        this.$store.state.entity.curatedEntities.some(entity => entity.identifier === entityUri);
      const fetchCuratedEntities = !this.$store.state.entity.curatedEntities;

      const contentfulVariables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };

      return Promise.all([
        this.$apis.entity.get(this.collectionType, this.$route.params.pathMatch),
        fetchCuratedEntities ? this.$contentful.query('curatedEntities', contentfulVariables) : () => null,
        fetchEntityPage ? this.$contentful.query('collectionPage', { ...contentfulVariables, identifier: entityUri }) : () => null
      ])
        .then(responses => {
          this.$store.commit('entity/setEntity', pick(responses[0].entity, [
            'id', 'logo', 'note', 'description', 'homepage', 'prefLabel', 'isShownBy', 'hasAddress', 'acronym', 'type'
          ]));
          if (fetchCuratedEntities) {
            const entitiesResponseData = responses[1].data.data;
            this.$store.commit('entity/setCuratedEntities', entitiesResponseData.curatedEntities.items);
          }
          if (fetchEntityPage) {
            const pageResponseData = responses[responses.length - 1].data.data;
            this.page = pageResponseData.entityPage.items[0];
          }
          this.$store.commit('search/setCollectionLabel', this.title.values[0]);
          return this.redirectToPrefPath();
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
      entity() {
        return this.$store.state.entity.entity;
      },
      recordsPerPage() {
        return this.$store.state.entity.recordsPerPage;
      },
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
        let description = null;

        if (this.editorialDescription) {
          description = { values: [this.editorialDescription], code: null };
        } else if (this.entity?.note) {
          description = langMapValueForLocale(this.entity.note, this.$i18n.locale);
        } else if (this.entity?.description) {
          description = langMapValueForLocale(this.entity.description, this.$i18n.locale);
        }

        return description;
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
      editorialImage() {
        return this.page?.primaryImageOfPage?.image || null;
      },
      editorialOverrides() {
        return { title: this.editorialTitle, image: this.editorialImage };
      },
      relatedCollectionCards() {
        if ((this.page?.relatedLinksCollection?.items?.length || 0) > 0) {
          return this.page.relatedLinksCollection.items.map(item => {
            const prefLabel = {
              [this.$i18n.locale]: item.name,
              en: item.nameEN
            };
            return {
              id: item.identifier,
              prefLabel,
              image: item.image
            };
          });
        }
        return null;
      },
      editable() {
        return this.$features.entityManagement &&
          this.entity &&
          this.userIsEntitiesEditor &&
          ['topic', 'organisation'].includes(this.collectionType);
      },
      userIsEntitiesEditor() {
        return this.$auth?.user?.resource_access?.entities?.roles.includes('editor') || false;
      },
      userIsSetsEditor() {
        return this.$auth?.user?.resource_access?.usersets?.roles.includes('editor') || false;
      },
      route() {
        return {
          name: 'collections-type-all',
          params: {
            type: this.collectionType,
            pathMatch: this.$route.params.pathMatch
          }
        };
      },
      title() {
        let title;

        if (!this.entity) {
          title = this.titleFallback();
        } else if (this.editorialTitle) {
          title = this.titleFallback(this.editorialTitle);
        } else if (this.organisationNativeName) {
          title = langMapValueForLocale(this.organisationNativeName, this.$i18n.locale);
        } else {
          title = langMapValueForLocale(this.entity.prefLabel, this.$i18n.locale);
        }

        return title;
      },
      subTitle() {
        return this.organisationNonNativeEnglishName ?
          langMapValueForLocale(this.organisationNonNativeEnglishName, this.$i18n.locale) :
          null;
      },
      hasUserQuery() {
        return this.$route.query.query &&  this.$route.query.query !== '';
      },
      thumbnail() {
        return this.$apis.entity.imageUrl(this.entity);
      },
      organisationNativeName() {
        return this.organizationEntityNativeName(this.entity);
      },
      organisationNonNativeEnglishName() {
        return this.organizationEntityNonNativeEnglishName(this.entity);
      },
      moreInfo() {
        if (!this.entity || this.collectionType !== 'organisation') {
          return null;
        }

        const labelledMoreInfo = [];

        if (this.organisationNonNativeEnglishName) {
          labelledMoreInfo.push({
            label: this.$t('organisation.englishName'),
            value: Object.values(this.organisationNonNativeEnglishName)[0],
            lang: Object.keys(this.organisationNonNativeEnglishName)[0]
          });
        }
        if (this.entity?.acronym)  {
          const langMapValue = langMapValueForLocale(this.entity.acronym, this.$i18n.locale);
          labelledMoreInfo.push({ label: this.$t('organisation.nameAcronym'), value: langMapValue.values[0], lang: langMapValue.code });
        }
        if (this.entity?.hasAddress?.countryName)  {
          labelledMoreInfo.push({ label: this.$t('organisation.country'), value: this.entity.hasAddress.countryName });
        }
        if (this.entity?.hasAddress?.locality)  {
          labelledMoreInfo.push({ label: this.$t('organisation.city'), value: this.entity.hasAddress.locality });
        }
        if (this.homepage)  {
          labelledMoreInfo.push({ label: this.$t('website'), value: this.homepage });
        }

        return labelledMoreInfo;
      }
    },
    watch: {
      searchOverrides: 'storeSearchOverrides'
    },
    mounted() {
      this.storeSearchOverrides();
      if (this.userIsEntitiesEditor) {
        this.$store.dispatch('entity/getFeatured');
      }
    },
    methods: {
      redirectToPrefPath() {
        const entityNameEn = this.page ? this.page.nameEN : this.entity.prefLabel.en;
        const desiredPath = getEntitySlug(this.entity.id, entityNameEn);
        if (this.$route.params.pathMatch !== desiredPath) {
          const redirectPath = this.$path({
            name: 'collections-type-all',
            params: { type: this.collectionType, pathMatch: desiredPath }
          });
          if (process.server) {
            this.$nuxt.context.redirect(302, redirectPath);
          } else {
            // _Replace_ history entry to prevent interference with back button
            this.$nuxt.context.app.router.replace(redirectPath);
          }
        }
      },
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
      },
      proxyUpdated() {
        this.$fetch();
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
