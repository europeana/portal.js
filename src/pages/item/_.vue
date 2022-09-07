<template>
  <div data-qa="item page">
    <b-container
      v-if="$fetchState.pending"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-else-if="$fetchState.error"
      data-qa="alert message container"
    >
      <b-row class="flex-md-row py-4">
        <b-col cols="12">
          <AlertMessage
            :error="$fetchState.error.message"
          />
        </b-col>
      </b-row>
    </b-container>
    <template
      v-else
    >
      <client-only>
        <ItemLanguageSelector
          v-if="translatedItemsEnabled"
          :from-translation-error="fromTranslationError"
          :metadata-language="metadataLanguage"
        />
      </client-only>
      <b-container
        fluid
        class="bg-white mb-3 px-0"
      >
        <ItemHero
          :all-media-uris="allMediaUris"
          :identifier="identifier"
          :media="media"
          :edm-rights="edmRights"
          :edm-type="type"
          :attribution-fields="attributionFields"
          :entities="europeanaEntities"
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
        <client-only
          v-if="relatedEntityUris.length > 0"
        >
          <b-row
            class="justify-content-center"
          >
            <b-col
              cols="12"
              class="col-lg-10 mt-4"
            >
              <RelatedCollections
                :title="$t('collectionsYouMightLike')"
                :entity-uris="relatedEntityUris"
                data-qa="related entities"
                badge-variant="light"
              />
            </b-col>
          </b-row>
        </client-only>
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
              :metadata="fieldsAndKeywords"
              :location="locationData"
              :metadata-language="metadataLanguage"
              :transcribing-annotations="transcribingAnnotations || []"
            />
          </b-col>
        </b-row>
        <client-only>
          <!--
            NOTE: dcType/title does not make sense here, but leave it alone as
                  eventually this will be deprecated and the Recommendation API
                  used instead.
            FIXME: ... but who knows when, so maybe fix here in the meantime
          -->
          <ItemRecommendations
            :identifier="identifier"
            :dc-type="title"
            :dc-subject="metadata.dcSubject"
            :dc-creator="metadata.dcCreator"
            :edm-data-provider="metadata.edmDataProvider ? metadata.edmDataProvider.value : null"
          />
        </client-only>
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
  import { mapGetters } from 'vuex';

  import ItemHero from '@/components/item/ItemHero';
  import ItemRecommendations from '@/components/item/ItemRecommendations';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import MetadataBox from '@/components/item/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import stringify from '@/mixins/stringify';

  export default {
    name: 'ItemPage',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ItemHero,
      ItemLanguageSelector: () => import('@/components/item/ItemLanguageSelector'),
      ItemRecommendations,
      LoadingSpinner,
      MetadataBox,
      RelatedCollections: () => import('@/components/related/RelatedCollections'),
      SummaryInfo: () => import('@/components/item/SummaryInfo')
    },

    mixins: [
      stringify
    ],

    data() {
      return {
        agents: [],
        allMediaUris: [],
        altTitle: null,
        annotations: [],
        cardGridClass: null,
        concepts: [],
        description: null,
        error: null,
        fromTranslationError: null,
        identifier: `/${this.$route.params.pathMatch}`,
        isShownAt: null,
        media: [],
        metadata: {},
        organizations: [],
        places: [],
        timespans: [],
        title: null,
        type: null,
        useProxy: true,
        schemaOrg: null,
        metadataLanguage: null
      };
    },

    async fetch() {
      try {
        const response = await this.$apis.record.getRecord(
          this.identifier,
          { locale: this.$i18n.locale, metadataLanguage: this.$route.query.lang }
        );
        for (const key in response.record) {
          this[key] = response.record[key];
        }
        if (process.client) {
          this.trackCustomDimensions();
        }
      } catch (error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = error.statusCode || 500;
        }
        throw error;
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
        return { ...this.metadata, keywords: this.keywords };
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
          .concat(this.places)
          .filter(entity => entity.about.startsWith(`${EUROPEANA_DATA_URL}/`));
      },
      europeanaEntityUris() {
        return this.europeanaEntities
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
        shareUrl: 'http/canonicalUrlWithoutLocale'
      }),
      relatedEntityUris() {
        return this.europeanaEntityUris.slice(0, 5);
      },
      translatedItemsEnabled() {
        return this.$features.translatedItems;
      },
      matomoOptions() {
        return {
          dimension1: langMapValueForLocale(this.metadata.edmCountry, 'en').values[0],
          dimension2: this.stringify(langMapValueForLocale(this.metadata.edmDataProvider?.value, 'en').values[0]),
          dimension3: this.stringify(langMapValueForLocale(this.metadata.edmProvider, 'en').values[0]),
          dimension4: langMapValueForLocale(this.metadata.edmRights, 'en').values[0]
        };
      }
    },

    watch: {
      '$route.query.lang'() {
        this.$fetch();
      }
    },

    mounted() {
      this.fetchAnnotations();
      if (!this.$fetchState.error && !this.$fetchState.pending) {
        this.timeoutUntilPiwikSet();
      }
    },

    methods: {
      // We need to give the async loading of the Matomo JS from the Matomo server
      // time to happen before trying to track custom dimensions.
      timeoutUntilPiwikSet(counter) {
        if (this.$matomo || counter > 100) {
          this.trackCustomDimensions();
        } else {
          setTimeout(() => {
            this.timeoutUntilPiwikSet(counter + 1);
          }, 10);
        }
      },

      trackCustomDimensions() {
        this.$matomo && this.$matomo.trackPageView('item page custom dimensions', this.matomoOptions);
      },

      annotationsByMotivation(motivation) {
        return this.annotations?.filter(annotation => annotation.motivation === motivation) || [];
      },

      async fetchAnnotations() {
        this.annotations = await this.$apis.annotation.search({
          query: `target_record_id:"${this.identifier}"`,
          profile: 'dereference'
        });
      }
    }
  };
</script>

<style scoped>
  .related-collections {
    margin-top: -0.5rem;
    margin-bottom: 2rem;
    padding: 0;
  }

  ::v-deep .related-collections .badge-light {
    margin-top: 0.25rem;
    margin-right: 0.5rem;
  }

  ::v-deep .card-header-tabs {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  ::v-deep .card-header-tabs .nav-link,
  ::v-deep .card-header-tabs .nav-link:hover {
    border-radius: 0.25rem 0 0;
  }
</style>
