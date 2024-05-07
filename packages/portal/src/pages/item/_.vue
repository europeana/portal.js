<template>
  <div
    data-qa="item page"
    class="page white-page"
    :class="$fetchState.error && 'pt-0'"
  >
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
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
      class="pt-5"
    />
    <template
      v-else
    >
      <!-- render item language selector inside IIIF wrapper so the iframe can take the available width becoming available upon closing -->
      <ItemLanguageSelector
        v-if="!iiifPresentationManifest && translatedItemsEnabled && showItemLanguageSelector"
        :from-translation-error="fromTranslationError"
        :metadata-language="metadataLanguage"
        @hidden="() => showItemLanguageSelector = false"
      />
      <b-container
        fluid
        class="bg-white mb-3 px-0"
      >
        <ItemHero
          :all-media-uris="allMediaUris"
          :identifier="identifier"
          :media="webResources"
          :edm-rights="edmRights"
          :edm-type="type"
          :attribution-fields="attributionFields"
          :link-for-contributing-annotation="linkForContributingAnnotation"
          :entities="europeanaEntities"
          :provider-url="isShownAt"
          :iiif-presentation-manifest="iiifPresentationManifest"
        >
          <template slot="item-language-selector">
            <ItemLanguageSelector
              v-if="translatedItemsEnabled && showItemLanguageSelector"
              :from-translation-error="fromTranslationError"
              :metadata-language="metadataLanguage"
              @hidden="() => showItemLanguageSelector = false"
            />
          </template>
        </ItemHero>
      </b-container>
      <b-container
        class="footer-margin"
      >
        <b-row class="mb-3 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <ItemSummaryInfo
              :description="descriptionInCurrentLanguage"
              :titles="titlesInCurrentLanguage"
            />
          </b-col>
        </b-row>
        <b-row
          class="provider-row mb-3 justify-content-center"
        >
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <ItemDataProvider
              :data-provider="!dataProviderEntityUri ? metadata.edmDataProvider : null"
              :data-provider-entity="dataProviderEntity"
              :metadata-language="metadataLanguage"
              :is-shown-at="isShownAt"
              :user-generated-content="metadata.edmUgc === 'true'"
            />
          </b-col>
        </b-row>
        <b-row class="mb-3 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10 mt-3"
          >
            <MetadataBox
              :metadata="fieldsAndKeywords"
              :location="locationData"
              :metadata-language="metadataLanguage"
            />
          </b-col>
        </b-row>
        <client-only
          v-if="relatedCollections.length > 0"
        >
          <b-row
            class="justify-content-center"
          >
            <b-col
              cols="12"
              class="col-lg-10 mt-4"
            >
              <EntityBadges
                :related-collections="relatedCollections"
                data-qa="related entities"
              />
            </b-col>
          </b-row>
        </client-only>
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
            :edm-data-provider="dataProviderEntityLabel"
          />
        </client-only>
      </b-container>
    </template>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import isEmpty from 'lodash/isEmpty.js';
  import pick from 'lodash/pick.js';

  import ItemDataProvider from '@/components/item/ItemDataProvider';
  import ItemHero from '@/components/item/ItemHero';
  import ItemRecommendations from '@/components/item/ItemRecommendations';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import MetadataBox from '@/components/metadata/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import WebResource from '@/plugins/europeana/edm/WebResource.js';
  import stringify from '@/mixins/stringify';
  import logEventMixin from '@/mixins/logEvent';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';
  import pageMetaMixin from '@/mixins/pageMeta';
  import redirectToMixin from '@/mixins/redirectTo';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

  export default {
    name: 'ItemPage',
    components: {
      ClientOnly,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ItemDataProvider,
      ItemHero,
      ItemLanguageSelector: () => import('@/components/item/ItemLanguageSelector'),
      ItemRecommendations,
      ItemSummaryInfo: () => import('@/components/item/ItemSummaryInfo'),
      LoadingSpinner,
      MetadataBox
    },

    mixins: [
      stringify,
      canonicalUrlMixin,
      pageMetaMixin,
      redirectToMixin,
      logEventMixin
    ],

    data() {
      return {
        agents: [],
        allMediaUris: [],
        altTitle: null,
        annotations: [],
        cardGridClass: null,
        concepts: [],
        dataProviderEntity: null,
        description: null,
        error: null,
        fromTranslationError: null,
        identifier: `/${this.$route.params.pathMatch}`,
        iiifPresentationManifest: null,
        isShownAt: null,
        media: [],
        metadata: {},
        metadataLanguage: null,
        organizations: [],
        places: [],
        relatedCollections: [],
        showItemLanguageSelector: true,
        timespans: [],
        title: null,
        type: null,
        useProxy: true
      };
    },

    async fetch() {
      // When entering a translated item page, but not logged in, redirect to non-translated item page
      if (this.$route.query.lang && !this.$auth.loggedIn) {
        this.redirectToAltRoute({ query: { lang: undefined } });
      } else {
        await this.fetchMetadata();
      }
    },

    computed: {
      webResources() {
        return this.media.map((webResource) => new WebResource(webResource, this.identifier));
      },
      pageMeta() {
        return {
          title: this.titlesInCurrentLanguage[0]?.value || this.$t('record.record'),
          description: isEmpty(this.descriptionInCurrentLanguage) ? '' : (this.descriptionInCurrentLanguage.values[0] || ''),
          ogType: 'article',
          ogImage: this.webResources[0]?.thumbnails(this.$nuxt.context)?.large
        };
      },
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
          provider: langMapValueForLocale(this.metadata.edmDataProvider, this.$i18n.locale).values[0],
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
      dataProviderEntityUri() {
        return this.metadata.edmDataProvider?.def?.[0].about || null;
      },
      dataProviderEntityLabel() {
        return this.metadata.edmDataProvider?.def?.[0].prefLabel;
      },
      taggingAnnotations() {
        return this.annotationsByMotivation('tagging');
      },
      linkForContributingAnnotation() {
        return this.annotationsByMotivation('linkForContributing')[0]?.body;
      },
      shareUrl() {
        return this.canonicalUrl({ fullPath: true, locale: false });
      },
      relatedEntityUris() {
        return this.europeanaEntityUris.filter(entityUri => entityUri !== this.dataProviderEntityUri).slice(0, 5);
      },
      translatedItemsEnabled() {
        return this.$features.translatedItems;
      },
      matomoOptions() {
        return {
          dimension1: langMapValueForLocale(this.metadata.edmCountry, 'en').values[0],
          dimension2: this.stringify(langMapValueForLocale(this.metadata.edmDataProvider, 'en').values[0]),
          dimension3: this.stringify(langMapValueForLocale(this.metadata.edmProvider, 'en').values[0]),
          dimension4: langMapValueForLocale(this.metadata.edmRights, 'en').values[0]
        };
      }
    },

    watch: {
      '$route.query.lang'() {
        this.fetchMetadata();
      },
      'relatedEntityUris'() {
        this.fetchEntities();
      }
    },

    mounted() {
      this.fetchEntities();
      this.fetchAnnotations();
      this.logEvent('view', `${ITEM_URL_PREFIX}${this.identifier}`);
      if (!this.$fetchState.error && !this.$fetchState.pending) {
        this.trackCustomDimensions();
      }
    },

    methods: {
      trackCustomDimensions() {
        if (!this.$waitForMatomo) {
          return;
        }

        this.$waitForMatomo()
          .then(() => this.$matomo.trackPageView('item page custom dimensions', this.matomoOptions))
          .catch(() => {});
      },

      annotationsByMotivation(motivation) {
        return this.annotations?.filter(annotation => annotation.motivation === motivation) || [];
      },

      async fetchMetadata() {
        try {
          const response = await this.$apis.record.getRecord(
            this.identifier,
            { locale: this.$i18n.locale, metadataLanguage: this.$auth.loggedIn ? this.$route.query.lang : undefined }
          );

          const responseIdentifier = response.record.identifier;
          if (this.identifier !== responseIdentifier) {
            this.redirectToAltRoute({ params: { pathMatch: responseIdentifier.slice(1) } });
          }

          for (const key in response.record) {
            this[key] = response.record[key];
          }

          if (process.client) {
            this.trackCustomDimensions();
          }
        } catch (e) {
          this.$error(e, { scope: 'item' });
        }
      },

      async fetchAnnotations() {
        this.annotations = await this.$apis.annotation.search({
          query: `target_record_id:"${this.identifier}"`,
          qf: 'motivation:(linkForContributing OR tagging)',
          profile: 'dereference'
        });
      },

      async fetchEntities() {
        if (this.dataProviderEntityUri) {
          // Fetch related entities and the dataProvider entity.
          // If the entities can't be fetched, use existing data from the record for the dataProvider section
          try {
            let entities = await this.$apis.entity.find([...this.relatedEntityUris, this.dataProviderEntityUri]);
            entities = entities?.map((entity) => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])) || [];
            this.relatedCollections = entities.filter((entity) => entity.id !== this.dataProviderEntityUri);
            this.dataProviderEntity = entities.filter((entity) => entity.id === this.dataProviderEntityUri)[0] || null;
          } catch {
            // don't fall over
          } finally {
            if (!this.dataProviderEntity) {
              const prefLabel = this.metadata.edmDataProvider.def[0].prefLabel;
              if (prefLabel) {
                Object.keys(prefLabel).forEach((key) => {
                  if (Array.isArray(prefLabel[key])) {
                    prefLabel[key] = prefLabel[key][0];
                  }
                });
                this.dataProviderEntity = { id: this.dataProviderEntityUri, prefLabel, type: 'Organization' };
              }
            }
          }
        } else if (this.relatedEntityUris.length > 0) {
          this.dataProviderEntity = null;

          const entities = await this.$apis.entity.find(this.relatedEntityUris);
          this.relatedCollections = entities?.map((entity) => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])) || [];
        } else {
          this.dataProviderEntity = null;
          this.relatedCollections = [];
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .page {
    padding-top: 2rem
  }

  .related-collections {
    margin-top: -0.5rem;
    margin-bottom: 1.5rem;
  }

  ::v-deep .card-header-tabs {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  ::v-deep .card-header-tabs .nav-link,
  ::v-deep .card-header-tabs .nav-link:hover {
    border-radius: 0.25rem 0 0;
  }
</style>
