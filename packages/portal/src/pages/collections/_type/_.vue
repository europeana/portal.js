<template>
  <div
    data-qa="entity page"
    class="entity-page xxl-page"
    :class="$fetchState.error && 'white-page'"
  >
    <ErrorMessage
      v-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <div
      v-else
    >
      <SearchInterface
        v-if="!$fetchState.pending"
        :route="route"
        :show-content-tier-toggle="false"
        :show-pins="userIsEntitiesEditor && userIsSetsEditor"
        :override-params="searchOverrides"
      >
        <EntityHeader
          v-if="entity"
          v-show="!hasUserQuery"
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
          #related-collections
        >
          <client-only>
            <EntityRelatedCollectionsCard
              :type="$route.params.type"
              :identifier="$route.params.pathMatch"
              :overrides="relatedCollections"
              data-qa="related entities"
              @entitiesFromUrisFetched="handleEntityRelatedCollectionsFetched"
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
            </b-container>
          </client-only>
        </template>
      </SearchInterface>
    </div>
  </div>
</template>

<script>
  import pick from 'lodash/pick';
  import ClientOnly from 'vue-client-only';

  import SearchInterface from '@/components/search/SearchInterface';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';
  import pageMetaMixin from '@/mixins/pageMeta';
  import entityBestItemsSetMixin from '@/mixins/europeana/entities/entityBestItemsSet';
  import redirectToMixin from '@/mixins/redirectTo';

  import {
    getEntityTypeApi, getEntityUri, getEntityQuery, normalizeEntityId
  } from '@/plugins/europeana/entity';
  import { langMapValueForLocale, uriRegex } from  '@europeana/i18n/src/langMap.js';

  export default {
    name: 'CollectionPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ClientOnly,
      EntityHeader: () => import('@/components/entity/EntityHeader'),
      EntityRelatedCollectionsCard: () => import('@/components/entity/EntityRelatedCollectionsCard'),
      RelatedEditorial: () => import('@/components/related/RelatedEditorial'),
      SearchInterface
    },

    mixins: [
      entityBestItemsSetMixin,
      europeanaEntitiesOrganizationsMixin,
      pageMetaMixin,
      redirectToMixin
    ],

    beforeRouteLeave(to, from, next) {
      if (to.matched[0].path !== `/${this.$i18n.locale}/search`) {
        this.$store.commit('search/setShowSearchBar', false);
      }
      this.$store.commit('entity/setId', null); // needed to re-enable auto-suggest in header
      this.$store.commit('entity/setEntity', null); // needed for best bets handling
      this.$store.commit('entity/setBestItemsSetId', null);
      this.$store.commit('entity/setPinned', []);
      next();
    },

    middleware: [
      'sanitisePageQuery'
    ],

    data() {
      return {
        proxy: null,
        relatedCollections: null
      };
    },

    async fetch() {
      if (!this.isRouteValid) {
        return this.$error(404, { scope: 'page' });
      }

      this.$store.commit('search/disableCollectionFacet');

      const entityUri = getEntityUri(this.collectionType, this.$route.params.pathMatch);
      if (entityUri !== this.$store.state.entity.id) {
        // TODO: group as a reset action on the store?
        this.$store.commit('entity/setId', null);
        this.$store.commit('entity/setEntity', null);
        this.$store.commit('entity/setPinned', null);
        this.$store.commit('entity/setEditable', false);
        this.$store.commit('entity/setBestItemsSetId', null);
      }
      this.$store.commit('entity/setId', entityUri);

      try {
        const response = await this.$apis.entity.get(this.collectionType, this.$route.params.pathMatch);

        this.$store.commit('entity/setEntity', pick(response.entity, [
          'id', 'logo', 'note', 'description', 'homepage', 'prefLabel', 'isShownBy', 'hasAddress', 'acronym', 'type', 'sameAs'
        ]));
        this.$store.commit('search/setCollectionLabel', this.title.values[0]);

        this.userIsEntitiesEditor && await this.setBestItems();

        return this.redirectToPrefPath(this.entity.id, this.entity.prefLabel.en);
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },

    computed: {
      isRouteValid() {
        return !!getEntityTypeApi(this.collectionType) &&
          this.entityId?.match(/^\d+$/);
      },
      pageMeta() {
        return {
          title: this.title.values[0],
          description: this.descriptionText,
          ogType: 'article'
        };
      },
      entity() {
        return this.$store.state.entity.entity;
      },
      searchOverrides() {
        const overrideParams = {};

        if (this.entity) {
          const entityQuery = getEntityQuery([this.entity.id].concat(this.entity.sameAs || []));
          overrideParams.qf = [entityQuery];
          if (!this.$route.query.query) {
            overrideParams.query = entityQuery; // Triggering best bets.
          }
        }

        return overrideParams;
      },
      entityId() {
        return normalizeEntityId(this.$route.params.pathMatch);
      },
      contextLabel() {
        return this.$t(`cardLabels.${this.collectionType}`);
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

        if (this.entity?.note) {
          description = langMapValueForLocale(this.entity.note, this.$i18n.locale);
        } else if (this.entity?.description) {
          description = langMapValueForLocale(this.entity.description, this.$i18n.locale);
        }

        return description;
      },
      descriptionText() {
        return ((this.description?.values?.length || 0) >= 1) ? this.description.values[0] : null;
      },
      homepage() {
        if (this.collectionType === 'organisation' &&
          this.entity?.homepage &&
          uriRegex.test(this.entity.homepage)) {
          return this.entity.homepage;
        }
        return null;
      },
      editable() {
        return this.entity &&
          this.userIsEntitiesEditor &&
          ['topic', 'organisation'].includes(this.collectionType);
      },
      userIsEntitiesEditor() {
        return this.$auth.userHasClientRole('entities', 'editor');
      },
      userIsSetsEditor() {
        return this.$auth.userHasClientRole('usersets', 'editor');
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
        // TODO: Update to use API country field?
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
    methods: {
      handleEntityRelatedCollectionsFetched(relatedCollections) {
        this.relatedCollections = relatedCollections;
      },
      async setBestItems() {
        const entityBestItemsSetId = await this.findEntityBestItemsSet(this.entity.id);
        this.$store.commit('entity/setBestItemsSetId', entityBestItemsSetId);
        entityBestItemsSetId && this.fetchEntityBestItemsSetPinnedItems(entityBestItemsSetId);
      },
      titleFallback(title) {
        return {
          values: [title],
          code: null
        };
      },
      proxyUpdated() {
        this.$fetch();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .entity-page {
    &.top-header {
      margin-top: -1rem;
    }
  }

  .page-container {
    max-width: none;
  }
</style>
