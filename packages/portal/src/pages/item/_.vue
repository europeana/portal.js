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
      <ItemLanguageSelector
        v-if="translatedItemsEnabled && showItemLanguageSelector"
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
        />
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
              :descriptions="metadata.dcDescription"
              :titles="allTitles"
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
              :data-provider="dataProviderEntityUri ? null : metadata.edmDataProvider?.[0]"
              :data-provider-entity="dataProviderEntity"
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
  import pick from 'lodash/pick.js';
  import isEqual from 'lodash/isEqual.js';
  import uniqWith from 'lodash/uniqWith.js';
  import merge from 'deepmerge';

  import ItemDataProvider from '@/components/item/ItemDataProvider';
  import ItemHero from '@/components/item/ItemHero';
  import ItemRecommendations from '@/components/item/ItemRecommendations';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import MetadataBox, { ALL_FIELDS as METADATA_FIELDS } from '@/components/metadata/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL, ITEM_URL_PREFIX } from '@/plugins/europeana/data';
  import {
    forEachLangMapValue, isLangMap, langMapValueForLocale, reduceLangMapsForLocale, selectLocaleForLangMap, undefinedLocaleCodes
  } from  '@europeana/i18n';
  import Item from '@/plugins/europeana/edm/Item.js';
  import WebResource from '@/plugins/europeana/edm/WebResource.js';
  import stringify from '@/mixins/stringify';
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
      stringify,
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
        ogImage: null,
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
          title: this.metadata.dcTitle?.[0]?.value || this.$t('record.record'),
          description: this.metadata.dcDescription?.[0]?.value,
          ogType: 'article',
          ogImage: this.ogImage
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
        return this.metadata.edmRights?.[0]?.value || '';
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
          title: this.metadata.dcTitle?.[0]?.value,
          creator: this.metadata.dcCreator?.[0]?.value,
          year: this.metadata.year?.[0]?.value,
          provider: this.metadata.edmDataProvider?.[0]?.value,
          country: this.metadata.edmCountry?.[0]?.value,
          url: this.shareUrl
        };
      },
      allTitles() {
        return [].concat(this.metadata.dcTitle, this.metadata.dctermsAlternative).filter(Boolean);
      },
      dataProviderEntityUri() {
        return this.metadata.edmDataProvider?.[0]?.about || null;
      },
      dataProviderEntityLabel() {
        return this.metadata.edmDataProvider?.[0]?.value;
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
          // FIXME: store these during the metadata fetch
          dimension1: langMapValueForLocale(this.metadata.edmCountry, 'en').values[0],
          dimension2: this.stringify(langMapValueForLocale(this.metadata.edmDataProvider, 'en').values[0]),
          dimension3: this.stringify(langMapValueForLocale(this.metadata.edmProvider, 'en').values[0]),
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

        // TODO: ideally, wouldn't store these as can be a large list if many WRs,
        //       but relied on by ItemHero to know whether to proxy download urls or not.
        //       could we deduce that from whether iiif is in use or not, and if
        //       so, whether a europeana manifest?
        //       - not iiif: proxy
        //       - iiif, europeana: proxy
        //       - iiif, institution: don't proxy
        this.allMediaUris = item.providerAggregation.displayableWebResources.map((wr) => wr.about);
        this.iiifPresentationManifest = item.iiifPresentationManifest;
        this.isShownAt = item.providerAggregation.edmIsShownAt;

        this.ogImage = new WebResource(item.providerAggregation.displayableWebResources[0], this.identifier)?.thumbnails(this.$nuxt.context)?.large;

        // don't store the web resources when using iiif as the manifest will be used
        if (!this.iiifPresentationManifest) {
          this.media = item.providerAggregation.displayableWebResources;
        }

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

      /**
       * Parse the record data based on the data from the API response
       * @param {Object} edm data from API response
       * @return {Object} parsed data
       */
      extractMetadata(edm) {
        let metadata = this.pickMetadata(edm);
        metadata = this.normaliseMetadata(metadata);
        metadata = this.limitMetadata(metadata);
        return this.linkMetadata(metadata);
      },

      pickMetadata(edm) {
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

        return pick({
          ...metadataSources,
          europeanaCollectionName: edm.europeanaCollectionName,
          timestampCreated: edm.timestamp_created,
          timestampUpdate: edm.timestamp_update
        }, METADATA_FIELDS.concat(['dcTitle', 'dctermsAlternative', 'dcDescription']));
      },

      limitMetadata(metadata) {
        for (const key in metadata) {
          if ((metadata[key].length || 0) > this.MAX_VALUES_PER_METADATA_FIELD) {
            metadata[key] = metadata[key].slice(0, this.MAX_VALUES_PER_METADATA_FIELD).concat('…');
          }
        }

        return metadata;
      },

      linkMetadata(metadata) {
        if (metadata.europeanaCollectionName?.[0]) {
          metadata.europeanaCollectionName[0].url = {
            name: 'search', query: { query: `europeana_collectionName:"${metadata.europeanaCollectionName[0].value}"` }
          };
        }

        return metadata;
      },

      normaliseLiteral(literal) {
        return literal;
      },

      normaliseLangMap(langMap) {
        const lang = selectLocaleForLangMap(langMap, this.metadataLanguage);
        const values = langMap[lang]
          .map((value) => ({ lang, value }));

        let entityDefValues = [];
        if ((lang !== 'def') && langMap.def) {
          entityDefValues = (langMap.def.filter((def) => this.findEntity(def)) || [])
            .map((value) => ({ lang: 'def', value }));
        }

        return values.concat(entityDefValues);
      },

      normaliseArray(array) {
        const values = array.map((element) => this.normaliseMetadataProperty(element));
        return uniqWith(values, isEqual);
      },

      normaliseEntity(entity) {
        const about = entity.about;
        const lang = selectLocaleForLangMap(entity.prefLabel, this.metadataLanguage);
        const prefLabel = entity.prefLabel[lang];
        const value = [].concat(prefLabel)[0];
        return { about, lang, value };
      },

      // each property may be:
      // - single literal
      // - array of literals
      // - lang map object, values of which may be arrays, literals, or entity IDs
      normaliseMetadataProperty(property) {
        if (Array.isArray(property)) {
          return this.normaliseArray(property);
        } else if (isLangMap(property)) {
          return this.normaliseLangMap(property);
        } else {
          return this.normaliseLiteral(property);
        }
      },

      normaliseMetadata(metadata) {
        return Object.keys(metadata).reduce((memo, key) => {
          const values = [].concat(this.normaliseMetadataProperty(metadata[key]));
          memo[key] = values.map((element) => {
            const valueElement = element?.value ? element : { value: element };
            return this.findEntity(valueElement.value) || valueElement;
          });
          return memo;
        }, {});
      },

      /**
       * Update a set of fields, in order to find linked entity data.
       * will match any literal values in  the 'def' key to about fields
       * in any of the entities and return the related object instead of
       * the plain string.
       * @param id Entity id
       * @return {Object[]} The normalised entity object
       */
      findEntity(id) {
        const entity = this.entities.find((entity) => entity.about === id);
        return entity ? this.normaliseEntity(entity) : null;
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
