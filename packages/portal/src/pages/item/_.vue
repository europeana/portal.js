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
        :translation-language="translationLanguage"
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
              :translation-language="translationLanguage"
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
            :dc-type="metadata.dcTitle"
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
  import merge from 'deepmerge';

  import ItemDataProvider from '@/components/item/ItemDataProvider';
  import ItemHero from '@/components/item/ItemHero';
  import ItemRecommendations from '@/components/item/ItemRecommendations';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import MetadataBox, { ALL_FIELDS as METADATA_FIELDS } from '@/components/metadata/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL, ITEM_URL_PREFIX } from '@/plugins/europeana/data';
  import {
    forEachLangMapValue, isLangMap, langMapValueForLocale, reduceLangMapsForLocale, undefinedLocaleCodes
  } from  '@europeana/i18n';
  import Item from '@/plugins/europeana/edm/Item.js';
  import WebResource from '@/plugins/europeana/edm/WebResource.js';
  import { stringify } from '@/utils/text.js';
  import logEventMixin from '@/mixins/logEvent';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';
  import pageMetaMixin from '@/mixins/pageMeta';
  import redirectToMixin from '@/mixins/redirectTo';

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
      canonicalUrlMixin,
      pageMetaMixin,
      redirectToMixin,
      logEventMixin
    ],

    data() {
      return {
        MAX_VALUES_PER_METADATA_FIELD: 10,
        allMediaUris: [],
        annotations: [],
        cardGridClass: null,
        dataProviderEntity: null,
        entities: [],
        error: null,
        fromTranslationError: null,
        identifier: `/${this.$route.params.pathMatch}`,
        iiifPresentationManifest: null,
        isShownAt: null,
        media: [],
        metadata: {},
        relatedCollections: [],
        showItemLanguageSelector: true,
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
        return this.entities.filter((entity) => entity.about.startsWith(`${EUROPEANA_DATA_URL}/`));
      },
      europeanaEntityUris() {
        return this.europeanaEntities
          .map(entity => entity.about);
      },
      attributionFields() {
        return {
          title: langMapValueForLocale(this.metadata.dcTitle, this.metadataLanguage).values[0],
          creator: langMapValueForLocale(this.metadata.dcCreator, this.metadataLanguage).values[0],
          year: langMapValueForLocale(this.metadata.year, this.metadataLanguage).values[0],
          provider: langMapValueForLocale(this.metadata.edmDataProvider, this.metadataLanguage).values[0],
          country: langMapValueForLocale(this.metadata.edmCountry, this.metadataLanguage).values[0],
          url: this.shareUrl
        };
      },
      titlesInCurrentLanguage() {
        const titles = [];

        const mainTitle = this.metadata.dcTitle ? langMapValueForLocale(this.metadata.dcTitle, this.metadataLanguage) : '';
        const alternativeTitle = this.metadata.dctermsAlternative ? langMapValueForLocale(this.metadata.dctermsAlternative, this.metadataLanguage) : '';

        const allTitles = [].concat(mainTitle, alternativeTitle).filter(Boolean);
        for (const title of allTitles) {
          for (const value of title.values) {
            titles.push({ 'code': title.code, value, translationSource: title.translationSource });
          }
        }
        return titles;
      },
      descriptionInCurrentLanguage() {
        if (!this.metadata.dcDescription) {
          return null;
        }
        return langMapValueForLocale(this.metadata.dcDescription, this.metadataLanguage);
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
        return this.europeanaEntityUris.filter((entityUri) => entityUri !== this.dataProviderEntityUri).slice(0, 5);
      },
      translatedItemsEnabled() {
        return this.$features.translatedItems;
      },
      matomoOptions() {
        return {
          dimension1: langMapValueForLocale(this.metadata.edmCountry, 'en').values[0],
          dimension2: stringify(langMapValueForLocale(this.metadata.edmDataProvider, 'en').values[0]),
          dimension3: stringify(langMapValueForLocale(this.metadata.edmProvider, 'en').values[0]),
          dimension4: langMapValueForLocale(this.metadata.edmRights, 'en').values[0]
        };
      },
      translatingMetadata() {
        return !!(this.$features?.translatedItems && this.$route.query.lang && this.$auth.loggedIn);
      },
      translationLanguage() {
        return this.translatingMetadata ? this.$route.query.lang : null;
      },
      metadataLanguage() {
        return this.translationLanguage || this.$i18n.locale;
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
        const params = {};
        if (this.translatingMetadata) {
          params.profile = 'translate';
          params.lang = this.translationLanguage;
        }

        let data;
        try {
          data = await this.$apis.record.get(this.identifier, params);
        } catch (error) {
          const errorResponse = error.response;
          if (errorResponse?.status === 502 && errorResponse?.data?.code === '502-TS' && !this.fromTranslationError) {
            this.fromTranslationError = true;
            data = await this.$apis.record.get(this.identifier);
          } else {
            return this.$error(error, { scope: 'item' });
          }
        }
        const edm = data.object;

        if (this.identifier !== edm.about) {
          return this.redirectToAltRoute({ params: { pathMatch: edm.about?.slice(1) } });
        }

        this.type = edm.type;

        const item = new Item(edm);

        this.allMediaUris = item.providerAggregation.displayableWebResources.map((wr) => wr.about);
        this.iiifPresentationManifest = item.iiifPresentationManifest;
        this.isShownAt = item.providerAggregation.edmIsShownAt;
        this.media = item.providerAggregation.displayableWebResources;

        this.entities = this.extractEntities(edm);

        this.metadata = this.extractMetadata(edm);

        process.client && this.trackCustomDimensions();
      },

      findProxy(proxies, type) {
        return proxies.find(proxy => proxy.about?.startsWith(`/proxy/${type}/`));
      },

      extractEntities(edm) {
        return [].concat(edm.concepts, edm.places, edm.agents, edm.timespans, edm.organizations)
          .filter(Boolean)
          .map((entity) => pick(entity, [
            'about',
            'latitude',
            'longitude',
            'prefLabel'
          ]))
          .map((entity) => reduceLangMapsForLocale(entity, this.metadataLanguage));
      },

      extractEuropeanaProxy(edm) {
        const europeanaProxy = this.findProxy(edm.proxies, 'europeana') || {};

        // Europeana proxy only really needed for the translate profile
        if (this.translatingMetadata) {
          for (const field in europeanaProxy) {
            if (europeanaProxy[field][this.translationLanguage]) {
              europeanaProxy[field].translationSource = 'automated';
            }
          }
        } else {
          forEachLangMapValue(europeanaProxy, (field, locale) => {
            if (!undefinedLocaleCodes.includes(locale)) {
              delete europeanaProxy[field][locale];
            }
          });
        }

        return europeanaProxy;
      },

      extractAggregatorProxy(edm) {
        const aggregatorProxy = this.findProxy(edm.proxies, 'aggregator') || {};
        const providerProxy = this.extractProviderProxy(edm);

        for (const field in aggregatorProxy) {
          if (aggregatorProxy[field] && this.localeSpecificFieldValueIsFromEnrichment(field, aggregatorProxy, providerProxy)) {
            aggregatorProxy[field].translationSource = 'enrichment';
          }
        }

        return aggregatorProxy;
      },

      extractProviderProxy(edm) {
        return this.findProxy(edm.proxies, 'provider') || {};
      },

      extractEuropeanaCollectionName(edm) {
        return edm.europeanaCollectionName ? {
          url: { name: 'search', query: { query: `europeana_collectionName:"${edm.europeanaCollectionName[0]}"` } },
          value: edm.europeanaCollectionName
        } : null;
      },

      /**
       * Parse the record data based on the data from the API response
       * @param {Object} edm data from API response
       * @return {Object} parsed data
       */
      extractMetadata(edm) {
        const providerAggregation = edm.aggregations[0];
        const europeanaAggregation = edm.europeanaAggregation;
        const providerProxy = this.extractProviderProxy(edm);
        const aggregatorProxy = this.extractAggregatorProxy(edm);
        const europeanaProxy = this.extractEuropeanaProxy(edm);

        const metadataSources = merge.all([
          providerAggregation,
          europeanaAggregation,
          providerProxy,
          aggregatorProxy,
          europeanaProxy
        ]);

        forEachLangMapValue(metadataSources, (field, locale) => {
          if (Array.isArray(metadataSources[field][locale]) && metadataSources[field][locale].length > this.MAX_VALUES_PER_METADATA_FIELD) {
            metadataSources[field][locale] = metadataSources[field][locale].slice(0, this.MAX_VALUES_PER_METADATA_FIELD).concat('…');
          }
        });

        const europeanaCollectionName = this.extractEuropeanaCollectionName(edm);

        const metadata = pick({
          ...this.lookupEntities(metadataSources),
          europeanaCollectionName,
          timestampCreated: edm.timestamp_created,
          timestampUpdate: edm.timestamp_update
        }, METADATA_FIELDS.concat(['dcTitle', 'dctermsAlternative', 'dcDescription']));

        return reduceLangMapsForLocale(metadata, this.metadataLanguage);
      },

      /**
       * Update a set of fields, in order to find linked entity data.
       * will match any literal values in  the 'def' key to about fields
       * in any of the entities and return the related object instead of
       * the plain string.
       * @param fields Object representing the metadata fields
       * @return {Object[]} The fields with any entities as JSON objects
       */
      lookupEntities(fields) {
        for (const key in fields) {
          // Only looks for entities in 'def'
          const values = (fields[key].def || []);
          for (const [index, value] of values.entries()) {
            const entity = this.entities.find((entity) => entity.about === value);
            if (entity) {
              fields[key].def[index] = entity;
            }
          }
        }
        return fields;
      },

      /**
      * Determine if a field will be displaying data from enrichment.
      * Should only be called in the context of a aggregatorProxy being present.
      * If the UI language is not in the enrichment, but also not in the default proxy,
      * the enrichment will be checked for an english fallback value which would take precedence.
      * @param {String} field the field name to check
      * @param {Object} aggregatorProxy the proxy with the enrichment data
      * @param {Object} providerProxy provider proxy, used to confirm whether preferable values exist outside the enriched data
      * @return {Boolean} true if enriched data will be shown
      */
      localeSpecificFieldValueIsFromEnrichment(field, aggregatorProxy, providerProxy) {
        return isLangMap(aggregatorProxy[field]) &&
          (
            this.proxyHasEntityForField(aggregatorProxy, field) ||
            this.proxyHasLanguageField(aggregatorProxy, field) ||
            this.proxyHasFallbackField(providerProxy, aggregatorProxy, field)
          );
      },

      proxyHasEntityForField(proxy, field) {
        return [].concat(proxy?.[field]?.def).some((def) => this.entities.find((entity) => entity.about === def));
      },

      proxyHasLanguageField(proxy, field) {
        return proxy?.[field]?.[this.metadataLanguage];
      },

      proxyHasFallbackField(proxy, fallbackProxy, field) {
        return (!proxy[field]?.[this.metadataLanguage] && fallbackProxy[field]?.en);
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
            this.dataProviderEntity = entities.find((entity) => entity.id === this.dataProviderEntityUri) || null;
          } catch {
            // don't fall over
          } finally {
            if (!this.dataProviderEntity) {
              const dataProviderPrefLabel = this.metadata.edmDataProvider.def[0].prefLabel;
              if (dataProviderPrefLabel) {
                const prefLabel = { ...dataProviderPrefLabel };
                for (const key in prefLabel) {
                  if (Array.isArray(prefLabel[key])) {
                    prefLabel[key] = prefLabel[key][0];
                  }
                }
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
