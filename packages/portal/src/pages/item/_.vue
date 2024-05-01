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
  import merge from 'deepmerge';

  import ItemDataProvider from '@/components/item/ItemDataProvider';
  import ItemHero from '@/components/item/ItemHero';
  import ItemRecommendations from '@/components/item/ItemRecommendations';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import MetadataBox from '@/components/metadata/MetadataBox';

  import { BASE_URL as EUROPEANA_DATA_URL, ITEM_URL_PREFIX } from '@/plugins/europeana/data';
  import {
    isLangMap, langMapValueForLocale, reduceLangMapsForLocale, undefinedLocaleCodes
  } from  '@/plugins/europeana/utils';
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
        MAX_VALUES_PER_PROXY_FIELD: 10,
        allMediaUris: [],
        altTitle: null,
        annotations: [],
        cardGridClass: null,
        dataProviderEntity: null,
        description: null,
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
        return this.entities.filter((entity) => entity.about.startsWith(`${EUROPEANA_DATA_URL}/`));
      },
      europeanaEntityUris() {
        return this.europeanaEntities
          .map(entity => entity.about);
      },
      attributionFields() {
        return {
          title: langMapValueForLocale(this.title, this.metadataLanguage).values[0],
          creator: langMapValueForLocale(this.metadata.dcCreator, this.metadataLanguage).values[0],
          year: langMapValueForLocale(this.metadata.year, this.metadataLanguage).values[0],
          provider: langMapValueForLocale(this.metadata.edmDataProvider, this.metadataLanguage).values[0],
          country: langMapValueForLocale(this.metadata.edmCountry, this.metadataLanguage).values[0],
          url: this.shareUrl
        };
      },
      titlesInCurrentLanguage() {
        const titles = [];

        const mainTitle = this.title ? langMapValueForLocale(this.title, this.metadataLanguage) : '';
        const alternativeTitle = this.altTitle ? langMapValueForLocale(this.altTitle, this.metadataLanguage) : '';

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
        return langMapValueForLocale(this.description, this.metadataLanguage);
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
          params.lang = this.metadataLanguage;
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

        this.storeMetadata(data);
        process.client && this.trackCustomDimensions();
      },

      storeMetadata(data) {
        const item = data.object;

        if (this.identifier !== item.about) {
          return this.redirectToAltRoute({ params: { pathMatch: item.about?.slice(1) } });
        }

        const parsed = this.parseRecordDataFromApiResponse(item);
        const reduced = reduceLangMapsForLocale(parsed, this.metadataLanguage, { freeze: false });

        // Restore `en` prefLabel on entities, e.g. for use in EntityBestItemsSet-type sets
        for (const reducedEntity of (reduced.entities || [])) {
          const fullEntity = (parsed.entities || []).find((entity) => entity.about === reducedEntity.about);
          if (fullEntity.prefLabel) {
            reducedEntity.prefLabel.en = fullEntity.prefLabel.en;
          }
        }

        for (const key in reduced) {
          this[key] = reduced[key];
        }
      },

      forEachLangMapValue(langMapContainer, callback) {
        for (const field in langMapContainer) {
          if (isLangMap(langMapContainer[field])) {
            for (const locale in langMapContainer[field]) {
              callback(langMapContainer, field, locale);
            }
          }
        }
      },

      findProxy(proxies, type) {
        return proxies.find(proxy => proxy.about?.startsWith(`/proxy/${type}/`));
      },

      /**
       * Parse the record data based on the data from the API response
       * @param {Object} edm data from API response
       * @return {Object} parsed data
       */
      parseRecordDataFromApiResponse(edm) {
        const providerAggregation = edm.aggregations[0];

        const entities = [].concat(edm.concepts, edm.places, edm.agents, edm.timespans, edm.organizations)
          .filter((entity) => !!entity)
          .map(this.reduceEntity)
          .map(Object.freeze);

        // Europeana proxy only really needed for the translate profile
        const europeanaProxy = this.findProxy(edm.proxies, 'europeana');
        if (!this.translatingMetadata) {
          this.forEachLangMapValue(europeanaProxy, (europeanaProxy, field, locale) => {
            if (!undefinedLocaleCodes.includes(locale)) {
              delete europeanaProxy[field][locale];
            }
          });
        }
        const aggregatorProxy = this.findProxy(edm.proxies, 'aggregator');
        const providerProxy = this.findProxy(edm.proxies, 'provider');

        const proxies = merge.all([europeanaProxy, aggregatorProxy, providerProxy].filter((p) => !!p));

        this.forEachLangMapValue(proxies, (proxies, field, locale) => {
          if (Array.isArray(proxies[field][locale]) && proxies[field][locale].length > this.MAX_VALUES_PER_PROXY_FIELD) {
            proxies[field][locale] = proxies[field][locale].slice(0, this.MAX_VALUES_PER_PROXY_FIELD).concat('…');
          }
        });

        for (const field in proxies) {
          if (aggregatorProxy?.[field] && this.localeSpecificFieldValueIsFromEnrichment(field, aggregatorProxy, providerProxy, this.metadataLanguage, entities)) {
            proxies[field].translationSource = 'enrichment';
          } else if (europeanaProxy?.[field]?.[this.metadataLanguage] && this.translatingMetadata) {
            proxies[field].translationSource = 'automated';
          }
        }

        const metadata = {
          ...this.lookupEntities(
            merge.all([proxies, providerAggregation, edm.europeanaAggregation]), entities
          ),
          europeanaCollectionName: edm.europeanaCollectionName ? {
            url: { name: 'search', query: { query: `europeana_collectionName:"${edm.europeanaCollectionName[0]}"` } },
            value: edm.europeanaCollectionName
          } : null,
          timestampCreated: edm.timestamp_created,
          timestampUpdate: edm.timestamp_update
        };

        const item = new Item(edm);

        return {
          allMediaUris: item.providerAggregation.displayableWebResources.map((wr) => wr.about),
          altTitle: proxies.dctermsAlternative,
          description: proxies.dcDescription,
          identifier: edm.about,
          type: edm.type, // TODO: Evaluate if this is used, if not remove.
          isShownAt: item.providerAggregation.edmIsShownAt,
          metadata: Object.freeze(metadata),
          media: item.providerAggregation.displayableWebResources,
          entities,
          title: proxies.dcTitle,
          iiifPresentationManifest: item.iiifPresentationManifest
        };
      },

      reduceEntity(entity) {
        return pick(entity, [
          'about',
          'latitude',
          'longitude',
          'prefLabel'
        ]);
      },

      /**
       * Update a set of fields, in order to find linked entity data.
       * will match any literal values in  the 'def' key to about fields
       * in any of the entities and return the related object instead of
       * the plain string.
       * @param fields Object representing the metadata fields
       * @param entities key(URI) value(JSON object) map of entity objects for this record
       * @return {Object[]} The fields with any entities as JSON objects
       */
      lookupEntities(fields, entities) {
        for (const key in fields) {
          this.setMatchingEntities(fields, key, entities);
        }
        return fields;
      },

      setMatchingEntities(fields, key, entities) {
        // Only looks for entities in 'def'
        const values = (fields[key]['def'] || []);
        for (const [index, value] of values.entries()) {
          const entity = entities.find((entity) => entity.about === value);
          if (entity) {
            fields[key]['def'][index] = entity;
          }
        }
      },

      /**
      * Determine if a field will be displaying data from enrichment.
      * Should only be called in the context of a aggregatorProxy being present.
      * If the UI language is not in the enrichment, but also not in the default proxy,
      * the enrichment will be checked for an english fallback value which would take precedence.
      * @param {String} field the field name to check
      * @param {Object} aggregatorProxy the proxy with the enrichment data
      * @param {Object} providerProxy provider proxy, used to confirm whether preferable values exist outside the enriched data
      * @param {String} lang the two letter language code which will be the prefered UI language
      * @return {Boolean} true if enriched data will be shown
      */
      localeSpecificFieldValueIsFromEnrichment(field, aggregatorProxy, providerProxy, lang, entities) {
        if (isLangMap(aggregatorProxy[field]) &&
          (this.proxyHasEntityForField(aggregatorProxy, field, entities) ||
            this.proxyHasLanguageField(aggregatorProxy, field, lang) ||
            this.proxyHasFallbackField(providerProxy, aggregatorProxy, field, lang)
          )
        ) {
          return true;
        }
        return false;
      },

      proxyHasEntityForField(proxy, field, entities) {
        if (Array.isArray(proxy?.[field]?.def)) {
          return proxy?.[field]?.def.some((def) => entities.find((entity) => entity.about === def));
        }
        return entities.find((entity) => entity.about === proxy?.[field]?.def);
      },

      proxyHasLanguageField(proxy, field, targetLanguage) {
        return proxy?.[field]?.[targetLanguage];
      },

      proxyHasFallbackField(proxy, fallbackProxy, field, targetLanguage) {
        return (!proxy[field]?.[targetLanguage] && fallbackProxy[field]?.['en']);
      },

      async fetchAnnotations() {
        this.annotations = await this.$apis.annotation.search({
          query: `target_record_id:"${this.identifier}"`,
          qf: 'motivation:(linkForContributing OR tagging)',
          profile: 'dereference'
        });
      },

      async fetchEntities() {
        const params = {
          fl: 'skos_prefLabel.*,isShownBy,isShownBy.thumbnail,foaf_logo'
        };
        if (this.dataProviderEntityUri) {
          // Fetch related entities and the dataProvider entity.
          // If the entities can't be fetched, use existing data from the record for the dataProvider section
          try {
            const entities = await this.$apis.entity.find([...this.relatedEntityUris, this.dataProviderEntityUri], params);

            if (entities)  {
              this.relatedCollections = entities.filter((entity) => entity.id !== this.dataProviderEntityUri);
              this.dataProviderEntity = entities.find((entity) => entity.id === this.dataProviderEntityUri);
            }
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

          const entities  = await this.$apis.entity.find(this.relatedEntityUris, params);
          this.relatedCollections = entities || [];
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
