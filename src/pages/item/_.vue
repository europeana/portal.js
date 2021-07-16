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
      <b-container
        fluid
        class="bg-white mb-3 px-0"
      >
        <ItemHero
          :all-media-uris="allMediaUris"
          :identifier="identifier"
          :media="media"
          :edm-rights="edmRights"
          :attribution-snippet="attributionSnippet"
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
              :all-metadata="allMetaData"
              :core-metadata="coreFields"
              :location="locationData"
              :transcribing-annotations="transcribingAnnotations"
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
  import axios from 'axios';
  import isEmpty from 'lodash/isEmpty';
  import { mapGetters } from 'vuex';

  import MetadataBox from '@/components/item/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import similarItemsQuery from '@/plugins/europeana/record/similar-items';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import rightsStatement from '@/mixins/rightsStatement';

  export default {
    components: {
      ItemHero: () => import('@/components/item/ItemHero'),
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ItemPreviewCardGroup: () => import('@/components/item/ItemPreviewCardGroup'),
      RelatedCollections: () => import('@/components/generic/RelatedCollections'),
      SummaryInfo: () => import('@/components/item/SummaryInfo'),
      MetadataBox,
      NotificationBanner: () => import('@/components/generic/NotificationBanner')
    },

    mixins: [
      rightsStatement
    ],

    fetch() {
      const annotationSearchParams = {
        query: `target_record_id:"${this.identifier}"`,
        profile: 'dereference'
      };
      axios.all([
        this.$apis.annotation.search(annotationSearchParams),
        this.$apis.entity.findEntities(this.europeanaEntityUris),
        this.getSimilarItems()
      ])
        .then(axios.spread((annotations, entities, similar) => {
          this.annotations = annotations;
          this.transcribingAnnotations = this.annotationsByMotivation('transcribing');
          this.taggingAnnotations = this.annotationsByMotivation('tagging');
          this.relatedEntities = entities;
          this.similarItems = similar.items;
        }));
    },

    fetchOnServer: false,

    asyncData({ params, res, app, $apis }) {
      return $apis.record
        .getRecord(`/${params.pathMatch}`, { locale: app.i18n.locale })
        .then(result => result.record)
        .catch(error => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode === 'undefined') ? 500 : error.statusCode;
          }
          return { error: error.message };
        });
    },

    data() {
      return {
        agents: null,
        allMediaUris: [],
        altTitle: null,
        annotations: [],
        cardGridClass: null,
        concepts: null,
        coreFields: null,
        description: null,
        error: null,
        fields: {},
        identifier: null,
        isShownAt: null,
        media: [],
        relatedEntities: [],
        similarItems: [],
        taggingAnnotations: [],
        timespans: null,
        title: null,
        transcribingAnnotations: [],
        type: null,
        useProxy: true,
        schemaOrg: null
      };
    },

    computed: {
      keywords() {
        // Convert collection of annotations' prefLabels into a single langMap
        return this.taggingAnnotations.reduce((memo, annotation) => {
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
        return { ...this.fields, ...{ keywords: this.keywords } };
      },
      allMetaData() {
        return { ...this.coreFields, ...this.fieldsAndKeywords };
      },
      locationData() {
        return this.fields.dctermsSpatial;
      },
      edmRights() {
        return this.fields.edmRights ? this.fields.edmRights.def[0] : '';
      },
      europeanaAgents() {
        return (this.agents || []).filter((agent) => agent.about.startsWith(`${EUROPEANA_DATA_URL}/agent/`));
      },
      europeanaConcepts() {
        return (this.concepts || []).filter((concept) => concept.about.startsWith(`${EUROPEANA_DATA_URL}/concept/`));
      },
      europeanaTimespans() {
        return (this.timespans || []).filter((timespan) => timespan.about.startsWith(`${EUROPEANA_DATA_URL}/timespan/`));
      },
      europeanaEntityUris() {
        const entities = this.europeanaConcepts.concat(this.europeanaAgents).concat(this.europeanaTimespans);
        return entities.map((entity) => entity.about).slice(0, 5);
      },
      attributionSnippet() {
        const title = langMapValueForLocale(this.title, this.$i18n.locale).values[0];
        const creator = langMapValueForLocale(this.coreFields.dcCreator, this.$i18n.locale).values[0];
        const year = langMapValueForLocale(this.fields.year, this.$i18n.locale).values[0];
        const provider = langMapValueForLocale(this.coreFields.edmDataProvider.value, this.$i18n.locale).values[0];
        const country = langMapValueForLocale(this.fields.edmCountry, this.$i18n.locale).values[0];
        const rights = this.rightsNameAndIcon(this.edmRights).name;
        const titleCreator = (title && creator && `${title} ${this.$t('blog.by')} ${creator}`) || title || creator;
        const providerCountry = (provider && country && `${provider}, ${country}`) || provider || country;

        let attributionData = [
          titleCreator,
          year,
          providerCountry,
          rights
        ]
          .filter(value => value) // remove empty
          .join(' - ') // output as a string
          .concat('.');
        if (this.shareUrl) {
          attributionData = attributionData.concat(`
${this.shareUrl}`);
        }
        return attributionData;
      },
      titlesInCurrentLanguage() {
        const titles = [];

        const mainTitle = this.title ? langMapValueForLocale(this.title, this.$i18n.locale) : '';
        const alternativeTitle = this.altTitle ? langMapValueForLocale(this.altTitle, this.$i18n.locale) : '';

        const allTitles = [].concat(mainTitle, alternativeTitle).filter(Boolean);
        for (const title of allTitles) {
          for (const value of title.values) {
            titles.push({ 'code': title.code, value });
          }
        }

        return titles;
      },
      descriptionInCurrentLanguage() {
        if (!this.description) {
          return false;
        }
        return langMapValueForLocale(this.description, this.$i18n.locale);
      },
      metaTitle() {
        return this.titlesInCurrentLanguage[0] ? this.titlesInCurrentLanguage[0].value : this.$t('record.record');
      },
      metaDescription() {
        if (isEmpty(this.descriptionInCurrentLanguage)) {
          return '';
        }
        return this.descriptionInCurrentLanguage.values[0] ? this.descriptionInCurrentLanguage.values[0] : '';
      },
      dataProvider() {
        const edmDataProvider = langMapValueForLocale(this.coreFields.edmDataProvider, this.$i18n.locale);

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
        return this.media[0] ? this.media[0].thumbnails.large : null;
      },
      ...mapGetters({
        shareUrl: 'http/canonicalUrl'
      })
    },

    mounted() {
      if (process.browser && this.fields) {
        this.$gtm.push(this.gtmOptions());
        this.$matomo && this.$matomo.trackPageView('item page custom dimensions', this.matomoOptions());
      }
    },

    methods: {
      annotationsByMotivation(motivation) {
        return this.annotations.filter(annotation => annotation.motivation === motivation);
      },

      getSimilarItems() {
        const noSimilarItems = { results: [] };
        if (this.error) {
          return noSimilarItems;
        }

        if (this.$config.app.features.recommendations && this.$auth.loggedIn) {
          return this.$apis.recommendation.recommend('record', this.identifier)
            .then(recommendResponse => recommendResponse);
        }

        const dataSimilarItems = {
          dcSubject: this.getSimilarItemsData(this.coreFields.dcSubject),
          dcType: this.getSimilarItemsData(this.title),
          dcCreator: this.getSimilarItemsData(this.coreFields.dcCreator),
          edmDataProvider: this.getSimilarItemsData(this.fields.edmDataProvider)
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
          return;
        }

        const data = langMapValueForLocale(value, this.$i18n.locale).values;
        if (!data) {
          return;
        }

        return data.filter(item => typeof item === 'string');
      },
      gtmOptions() {
        return {
          itemCountry: langMapValueForLocale(this.fields.edmCountry, 'en').values[0],
          itemDataProvider: langMapValueForLocale(this.coreFields.edmDataProvider.value, 'en').values[0],
          itemProvider: langMapValueForLocale(this.fields.edmProvider, 'en').values[0],
          itemRights: langMapValueForLocale(this.fields.edmRights, 'en').values[0]
        };
      },
      matomoOptions() {
        return {
          dimension1: langMapValueForLocale(this.fields.edmCountry, 'en').values[0],
          dimension2: langMapValueForLocale(this.coreFields.edmDataProvider.value, 'en').values[0],
          dimension3: langMapValueForLocale(this.fields.edmProvider, 'en').values[0],
          dimension4: langMapValueForLocale(this.fields.edmRights, 'en').values[0]
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

    beforeRouteLeave(to, from, next) {
      this.$gtm.push({
        itemCountry: undefined,
        itemDataProvider: undefined,
        itemProvider: undefined,
        itemRights: undefined
      });
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
