<template>
  <div data-qa="item page">
    <NotificationBanner
      v-if="redirectNotificationsEnabled"
      :notification-url="notificationUrl"
      :notification-text="$t('linksToClassic.record.text')"
      :notification-link-text="$t('linksToClassic.record.linkText')"
    />
    <b-container v-if="error">
      <AlertMessage
        :error="error"
      />
    </b-container>
    <template
      v-else
    >
      <ItemLanguageSelector
        v-if="translatedItemsEnabled"
        :item-language="edmLanguage.def[0]"
        :metadata-language="metadataLanguage"
      />
      <b-container
        fluid
        class="bg-white mb-3 px-0"
      >
        <ItemHero
          :all-media-uris="allMediaUris"
          :identifier="identifier"
          :media="media"
          :edm-rights="edmRights"
          :attribution-fields="attributionFields"
        />
      </b-container>
      <b-container>
        <b-row class="mb-3 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <SummaryInfo
              :description="descriptionInCurrentLanguage"
              :titles="titlesInCurrentLanguage"
            />
          </b-col>
        </b-row>
        <b-row
          v-if="relatedEntities && relatedEntities.length > 0"
          class="justify-content-center"
        >
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <RelatedCollections
              :title="$t('collectionsYouMightLike')"
              :related-collections="relatedEntities"
              data-qa="related entities"
            />
          </b-col>
        </b-row>
        <b-row
          v-else
          class="mb-3"
        />
        <b-row class="mb-0 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <MetadataBox
              v-model="fieldsAndKeywords"
              :location="locationData"
              :metadata-language="metadataLanguage"
              :transcribing-annotations="transcribingAnnotations || []"
            />
          </b-col>
        </b-row>
        <b-row
          v-if="similarItems && similarItems.length > 0"
          class="mt-3 mb-0 justify-content-center"
        >
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <h2
              class="related-heading text-uppercase mb-2"
            >
              {{ $t('record.exploreMore') }}
            </h2>
            <ItemPreviewCardGroup
              v-model="similarItems"
              view="explore"
              class="mb-0"
              data-qa="similar items"
            />
          </b-col>
        </b-row>
        <b-row class="footer-margin" />
      </b-container>
    </template>
    <client-only>
      <!-- eslint-disable vue/no-v-html -->
      <script
        v-if="schemaOrg"
        type="application/ld+json"
        v-html="schemaOrg"
      />
      <!-- eslint-enable vue/no-v-html -->
    </client-only>
  </div>
</template>

<script>
  import isEmpty from 'lodash/isEmpty';
  import { mapState, mapGetters } from 'vuex';

  import MetadataBox from '@/components/item/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import similarItemsQuery from '@/plugins/europeana/record/similar-items';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    components: {
      ItemHero: () => import('@/components/item/ItemHero'),
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ItemPreviewCardGroup: () => import('@/components/item/ItemPreviewCardGroup'),
      RelatedCollections: () => import('@/components/generic/RelatedCollections'),
      SummaryInfo: () => import('@/components/item/SummaryInfo'),
      MetadataBox,
      NotificationBanner: () => import('@/components/generic/NotificationBanner'),
      ItemLanguageSelector: () => import('@/components/item/ItemLanguageSelector')
    },

    fetch() {
      this.fetchAnnotations();
      this.fetchRelatedEntities();
      this.fetchSimilarItems();
    },

    fetchOnServer: false,

    asyncData({ params, res, route, app, $apis }) {
      return $apis.record
        .getRecord(`/${params.pathMatch}`, { locale: app.i18n.locale, metadataLanguage: route.query.lang })
        .then(result => {
          return result.record;
        })
        .catch(error => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode === 'undefined') ? 500 : error.statusCode;
          }
          return { error: error.message };
        });
    },

    data() {
      return {
        agents: [],
        allMediaUris: [],
        altTitle: null,
        cardGridClass: null,
        concepts: [],
        description: null,
        error: null,
        identifier: null,
        isShownAt: null,
        media: [],
        metadata: {},
        organizations: [],
        timespans: [],
        title: null,
        type: null,
        useProxy: true,
        schemaOrg: null,
        edmLanguage: null,
        metadataLanguage: null
      };
    },

    computed: {
      keywords() {
        // Convert collection of annotations' prefLabels into a single langMap
        return this.taggingAnnotations?.reduce((memo, annotation) => {
          for (const lang in annotation.body.prefLabel) {
            if (!memo[lang]) {
              memo[lang] = [];
            }
            memo[lang] = memo[lang].concat(annotation.body.prefLabel[lang]);
          }
          return memo;
        }, {});
      },
      fieldsAndKeywords() {
        return { ...this.metadata, ...{ keywords: this.keywords } };
      },
      locationData() {
        return this.metadata.dctermsSpatial;
      },
      edmRights() {
        return this.metadata.edmRights?.def[0] || '';
      },
      europeanaEntities() {
        return this.agents
          .concat(this.concepts)
          .concat(this.timespans)
          .concat(this.organizations)
          .filter(entity => entity.about.startsWith(`${EUROPEANA_DATA_URL}/`));
      },
      europeanaEntityUris() {
        return this.europeanaEntities
          .slice(0, 5)
          .map(entity => entity.about);
      },
      attributionFields() {
        return {
          title: langMapValueForLocale(this.title, this.metadataLanguage || this.$i18n.locale).values[0],
          creator: langMapValueForLocale(this.metadata.dcCreator, this.$i18n.locale).values[0],
          year: langMapValueForLocale(this.metadata.year, this.$i18n.locale).values[0],
          provider: langMapValueForLocale(this.metadata.edmDataProvider?.value, this.$i18n.locale).values[0],
          country: langMapValueForLocale(this.metadata.edmCountry, this.$i18n.locale).values[0],
          url: this.shareUrl
        };
      },
      titlesInCurrentLanguage() {
        const titles = [];

        const mainTitle = this.title ? langMapValueForLocale(this.title, this.metadataLanguage || this.$i18n.locale, { uiLanguage: this.$i18n.locale }) : '';
        const alternativeTitle = this.altTitle ? langMapValueForLocale(this.altTitle, this.$i18n.locale, { uiLanguage: this.$i18n.locale }) : '';

        const allTitles = [].concat(mainTitle, alternativeTitle).filter(Boolean);
        for (const title of allTitles) {
          for (const value of title.values) {
            titles.push({ 'code': title.code, value, translationSource: title.translationSource });
          }
        }
        return titles;
      },
      descriptionInCurrentLanguage() {
        if (!this.description) {
          return null;
        }
        return langMapValueForLocale(this.description, this.metadataLanguage || this.$i18n.locale, { uiLanguage: this.$i18n.locale });
      },
      metaTitle() {
        return this.titlesInCurrentLanguage[0] ? this.titlesInCurrentLanguage[0].value : this.$t('record.record');
      },
      metaDescription() {
        if (isEmpty(this.descriptionInCurrentLanguage)) {
          return '';
        }
        return this.descriptionInCurrentLanguage.values[0] || '';
      },
      dataProvider() {
        const edmDataProvider = langMapValueForLocale(this.metadata.edmDataProvider, this.$i18n.locale);

        if (edmDataProvider.values[0].about) {
          return edmDataProvider.values[0];
        }

        return edmDataProvider;
      },
      notificationUrl() {
        return `https://classic.europeana.eu/portal/${this.$i18n.locale}/record${this.identifier}.html?utm_source=new-website&utm_medium=button`;
      },
      redirectNotificationsEnabled() {
        return this.$config.app.features.linksToClassic;
      },
      pageHeadMetaOgImage() {
        return this.media[0]?.thumbnails?.large || null;
      },
      taggingAnnotations() {
        return this.annotationsByMotivation('tagging');
      },
      transcribingAnnotations() {
        return this.annotationsByMotivation('transcribing');
      },
      ...mapGetters({
        shareUrl: 'http/canonicalUrl',
        annotationsByMotivation: 'item/annotationsByMotivation'
      }),
      ...mapState({
        relatedEntities: state => state.item.relatedEntities,
        similarItems: state => state.item.similarItems,
        annotations: state => state.item.annotations
      }),
      translatedItemsEnabled() {
        return this.$config.app.features.translatedItems;
      }
    },

    mounted() {
      if (!this.error) {
        this.$matomo && this.$matomo.trackPageView('item page custom dimensions', this.matomoOptions());
      }
    },

    methods: {
      fetchAnnotations() {
        const annotationSearchParams = {
          query: `target_record_id:"${this.identifier}"`,
          profile: 'dereference'
        };

        return this.$apis.annotation.search(annotationSearchParams)
          .then(annotations => {
            this.$store.commit('item/setAnnotations', annotations);
          });
      },

      fetchRelatedEntities() {
        return this.$apis.entity.findEntities(this.europeanaEntityUris)
          .then(entities => {
            this.$store.commit('item/setRelatedEntities', entities);
          });
      },

      fetchSimilarItems() {
        return this.getSimilarItems()
          .then(similar => {
            this.$store.commit('item/setSimilarItems', similar.items);
          });
      },

      getSimilarItems() {
        const noSimilarItems = { results: [] };
        if (this.error) {
          return Promise.resolve(noSimilarItems);
        }

        if (this.$config.app.features.recommendations && this.$auth.loggedIn) {
          return this.$apis.recommendation.recommend('record', this.identifier)
            .then(recommendResponse => recommendResponse);
        }

        const dataSimilarItems = {
          dcSubject: this.getSimilarItemsData(this.metadata.dcSubject),
          dcType: this.getSimilarItemsData(this.title), // TODO: Evaluate why title is being set as type here.
          dcCreator: this.getSimilarItemsData(this.metadata.dcCreator),
          edmDataProvider: this.getSimilarItemsData(this.metadata.edmDataProvider)
        };

        return this.$apis.record.search({
          query: similarItemsQuery(this.identifier, dataSimilarItems),
          rows: 4,
          profile: 'minimal',
          facet: ''
        })
          .then(response => response)
          .catch(() => {
            return noSimilarItems;
          });
      },

      getSimilarItemsData(value) {
        if (!value) {
          return null;
        }

        const data = langMapValueForLocale(value, this.$i18n.locale).values;
        if (!data) {
          return null;
        }

        return data.filter(item => typeof item === 'string');
      },
      matomoOptions() {
        return {
          dimension1: langMapValueForLocale(this.metadata.edmCountry, 'en').values[0],
          dimension2: langMapValueForLocale(this.metadata.edmDataProvider.value, 'en').values[0],
          dimension3: langMapValueForLocale(this.metadata.edmProvider, 'en').values[0],
          dimension4: langMapValueForLocale(this.metadata.edmRights, 'en').values[0]
        };
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.metaTitle),
        meta: [
          { hid: 'title', name: 'title', content: this.metaTitle },
          { hid: 'description', name: 'description', content: this.metaDescription },
          { hid: 'og:title', property: 'og:title', content: this.metaTitle },
          { hid: 'og:description', property: 'og:description', content: this.metaDescription },
          { hid: 'og:image', property: 'og:image', content: this.pageHeadMetaOgImage },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
      };
    },

    watchQuery: ['lang'],

    async beforeRouteUpdate(to, from, next) {
      if (to.path !== from.path) {
        // Navigation to another item
        await this.$store.dispatch('item/reset');
      }
      next();
    },
    async beforeRouteLeave(to, from, next) {
      await this.$store.dispatch('item/reset');
      next();
    }
  };
</script>

<style scoped>
  .related-collections {
    margin-top: -0.5rem;
    margin-bottom: 2rem;
    padding: 0;
  }

  ::v-deep .card-header-tabs {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  ::v-deep .card-header-tabs .nav-link,
  ::v-deep .card-header-tabs .nav-link:hover {
    border-radius: 0.25rem 0 0 0;
  }
</style>
