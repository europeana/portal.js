import pick from 'lodash/pick.js';
import uniq from 'lodash/uniq.js';
import merge from 'deepmerge';

import { apiError, createAxios, reduceLangMapsForLocale, isLangMap } from './utils.js';
import search from './search.js';
import thumbnail, { thumbnailTypeForMimeType } from  './thumbnail.js';
import { isIIIFPresentation, isIIIFImage } from '../media.js';

import { ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX } from './data.js';
import { BASE_URL as EUROPEANA_MEDIA_PROXY_URL } from './proxy.js';

export const BASE_URL = 'https://api.europeana.eu/record';
export const FULLTEXT_BASE_URL = 'https://newspapers.eanadev.org/api/v2';
const MAX_VALUES_PER_PROXY_FIELD = 10;

/**
 * Sorts an array of objects by the `isNextInSequence` property.
 *
 * Logic:
 * * Any objects not having `isNextInSequence` will not be moved.
 * * Any objects having `isNextInSequence` will be moved to the position
 *   immediately following the other object whose `about` property matches this
 *   one's `isNextInSequence`
 *
 * @param {Object[]} source items to sort
 * @return {Object[]} sorted items
 * @example
 *    const unsorted = [
 *      { about: 'd', isNextInSequence: 'c' },
 *      { about: 'b', isNextInSequence: 'a' },
 *      { about: 'a' },
 *      { about: 'c', isNextInSequence: 'b' }
 *    ];
 *    const sorted = sortByIsNextInSequence(unsorted);
 *    console.log(sorted[0].about); // expected output: 'a'
 *    console.log(sorted[1].about); // expected output: 'b'
 *    console.log(sorted[2].about); // expected output: 'c'
 *    console.log(sorted[3].about); // expected output: 'd'
 */
function sortByIsNextInSequence(source) {
  // Make a copy to work on
  const items = [].concat(source);

  const itemUris = items.map((item) => item.about);

  for (const uri of itemUris) {
    // It's necessary to find the item on each iteration to sort as it may have
    // been moved from its original position by a previous iteration.
    const sortItemIndex = items.findIndex((item) => item.about === uri);
    const sortItem = items[sortItemIndex];

    // If it has isNextInSequence property, move it after that item; else
    // leave it be.
    if (sortItem.isNextInSequence) {
      const isPreviousInSequenceIndex = items.findIndex((item) => item.about === sortItem.isNextInSequence);
      if (isPreviousInSequenceIndex !== -1) {
        // Remove the item from its original position.
        items.splice(sortItemIndex, 1);
        // Insert the item after its predecessor.
        items.splice(isPreviousInSequenceIndex + 1, 0, sortItem);
      }
    }
  }

  return items;
}

function isUndefined(value) {
  return value === undefined;
}
function isNotUndefined(value) {
  return !isUndefined(value);
}

/**
 * Update a set of fields, in order to find linked entity data.
 * will match any literal values in  the 'def' key to about fields
 * in any of the entities and return the related object instead of
 * the plain string.
 * @param fields Object representing the metadata fields
 * @param entities key(URI) value(JSON object) map of entity objects for this record
 * @return {Object[]} The fields with any entities as JSON objects
 */
function lookupEntities(fields, entities) {
  for (const key in fields) {
    setMatchingEntities(fields, key, entities);
  }
  return fields;
}

function setMatchingEntities(fields, key, entities) {
  // Only looks for entities in 'def'
  const values = (fields[key]['def'] || []);
  for (const [index, value] of values.entries()) {
    if (entities[value]) {
      fields[key]['def'][index] = entities[value];
    }
  }
}

const findProxy = (proxies, type) => proxies.find(proxy => proxy.about?.startsWith(`/proxy/${type}/`));

/**
* Determine if a field will be displaying data from enrichment.
* Should only be called in the context of a aggregatorProxy being present.
* If the UI language is not in the enrichment, but also not in the default proxy,
* the enrichment will be checked for an english fallback value which would take precedence.
* @param {String} field the field name to check
* @param {Object} aggregatorProxy the proxy with the enrichment data
* @param {Object} providerProxy provider proxy, used to confirm whether preferable values exist outside the enriched data
* @param {String} predictedUiLang the two letter language code which will be the prefered UI language
* @return {Boolean} true if enriched data will be shown
*/
const localeSpecificFieldValueIsFromEnrichment = (field, aggregatorProxy, providerProxy, predictedUiLang, entities) => {
  if (isLangMap(aggregatorProxy[field]) &&
       (proxyHasEntityForField(aggregatorProxy, field, entities) ||
         proxyHasLanguageField(aggregatorProxy, field, predictedUiLang) ||
         proxyHasFallbackField(providerProxy, aggregatorProxy, field, predictedUiLang)
       )
  ) {
    return true;
  }
  return false;
};

const proxyHasEntityForField = (proxy, field, entities) => {
  if (Array.isArray(proxy?.[field]?.def)) {
    return proxy?.[field]?.def.some(key => {
      return entities[key];
    });
  }
  return entities[proxy?.[field]?.def];
};

const proxyHasLanguageField = (proxy, field, targetLanguage) => {
  return proxy?.[field]?.[targetLanguage];
};

const proxyHasFallbackField = (proxy, fallbackProxy, field, targetLanguage) => {
  return (!proxy[field]?.[targetLanguage] && fallbackProxy[field]?.['en']);
};

export default (context = {}) => {
  const $axios = createAxios({ id: 'record', baseURL: BASE_URL }, context);
  const thumbnailUrl = thumbnail(context).media;

  return {
    $axios,

    search(params, options = {}) {
      return search(context)($axios, params, options);
    },

    /**
     * Find records by their identifier
     * @param {Array} europeanaIds record identifiers or URIs
     * @param {Object} params additional options to include in the API search query
     * @return {Array} record data as returned by the API
     */
    find(europeanaIds, params = {}) {
      europeanaIds = europeanaIds.map(id => id.replace(EUROPEANA_DATA_URL_ITEM_PREFIX, ''));
      const query = `europeana_id:("${europeanaIds.join('" OR "')}")`;
      return this.search({
        query,
        ...params
      }, { addContentTierFilter: false });
    },

    /**
     * Parse the record data based on the data from the API response
     * @param {Object} edm data from API response
     * @return {Object} parsed data
     */
    parseRecordDataFromApiResponse(data, options = {}) {
      const edm = data.object;
      const providerAggregation = edm.aggregations[0];

      const concepts = (edm.concepts || []).map(reduceEntity).map(Object.freeze);
      const places = (edm.places || []).map(reduceEntity).map(Object.freeze);
      const agents = (edm.agents || []).map(reduceEntity).map(Object.freeze);
      const timespans = (edm.timespans || []).map(reduceEntity).map(Object.freeze);
      const organizations = (edm.organizations || []).map(reduceEntity).map(Object.freeze);

      const entities = [].concat(concepts, places, agents, timespans, organizations)
        .filter(isNotUndefined)
        .reduce((memo, entity) => {
          memo[entity.about] = entity;
          return memo;
        }, {});

      const proxies = merge.all(edm.proxies);

      for (const field in proxies) {
        if (isLangMap(proxies[field])) {
          for (const locale in proxies[field]) {
            if (Array.isArray(proxies[field][locale]) && proxies[field][locale].length > MAX_VALUES_PER_PROXY_FIELD) {
              proxies[field][locale] = proxies[field][locale].slice(0, MAX_VALUES_PER_PROXY_FIELD).concat('…');
            }
          }
        }
      }

      let prefLang;
      if (context.$features?.translatedItems) {
        prefLang = options.metadataLanguage ? options.metadataLanguage : null;
      }
      const predictedUiLang = prefLang || options.locale;

      // Europeana proxy only really needed for the translate profile
      const europeanaProxy = findProxy(edm.proxies, 'europeana');
      const aggregatorProxy = findProxy(edm.proxies, 'aggregator');
      const providerProxy = findProxy(edm.proxies, 'provider');

      for (const field in proxies) {
        if (aggregatorProxy?.[field] && localeSpecificFieldValueIsFromEnrichment(field, aggregatorProxy, providerProxy, predictedUiLang, entities)) {
          proxies[field].translationSource = 'enrichment';
        } else if (europeanaProxy?.[field]?.[predictedUiLang] && context.$features?.translatedItems) {
          proxies[field].translationSource = 'automated';
        }
      }

      const metadata = {
        ...lookupEntities(
          merge.all([proxies, edm.aggregations[0], edm.europeanaAggregation]), entities
        ),
        europeanaCollectionName: edm.europeanaCollectionName ? {
          url: { name: 'search', query: { query: `europeana_collectionName:"${edm.europeanaCollectionName[0]}"` } },
          value: edm.europeanaCollectionName
        } : null,
        timestampCreated: edm.timestamp_created,
        timestampUpdate: edm.timestamp_update
      };
      metadata.edmDataProvider = {
        url: providerAggregation.edmIsShownAt, value: metadata.edmDataProvider
      };

      const allMediaUris = this.aggregationMediaUris(providerAggregation).map(Object.freeze);
      return {
        allMediaUris,
        altTitle: proxies.dctermsAlternative,
        description: proxies.dcDescription,
        fromTranslationError: options.fromTranslationError,
        identifier: edm.about,
        type: edm.type, // TODO: Evaluate if this is used, if not remove.
        isShownAt: providerAggregation.edmIsShownAt,
        metadata: Object.freeze(metadata),
        media: this.aggregationMedia(providerAggregation, allMediaUris, edm.type, edm.services),
        agents,
        concepts,
        timespans,
        organizations,
        places,
        title: proxies.dcTitle,
        schemaOrg: data.schemaOrg ? Object.freeze(JSON.stringify(data.schemaOrg)) : undefined,
        metadataLanguage: prefLang
      };
    },

    webResourceThumbnails(webResource, aggregation, recordType) {
      const type = thumbnailTypeForMimeType(webResource.ebucoreHasMimeType) || recordType;

      let uri = webResource.about;
      if (aggregation.edmObject && ([aggregation.edmIsShownBy, aggregation.edmIsShownAt].includes(uri))) {
        uri = aggregation.edmObject;
      }

      return {
        small: thumbnailUrl(uri, {
          size: 200,
          type
        }),
        large: thumbnailUrl(uri, {
          size: 400,
          type
        })
      };
    },

    aggregationMediaUris(aggregation) {
      // Gather all isShownBy/At and hasView URIs
      const edmIsShownByOrAt = aggregation.edmIsShownBy || aggregation.edmIsShownAt;
      return uniq([edmIsShownByOrAt].concat(aggregation.hasView || []).filter(isNotUndefined));
    },

    aggregationMedia(aggregation, mediaUris, recordType, services = []) {
      // Filter web resources to isShownBy and hasView, respecting the ordering
      const media = mediaUris
        .map(mediaUri => aggregation.webResources.find(webResource => mediaUri === webResource.about))
        .map(reduceWebResource);

      for (const webResource of media) {
        // Inject thumbnail URLs
        webResource.thumbnails = this.webResourceThumbnails(webResource, aggregation, recordType);

        // Inject service definitions, e.g. for IIIF
        webResource.services = services.filter((service) => (webResource.svcsHasService || []).includes(service.about));

        // Add isShownAt to disable download for these webresources as they ar website URLs and not actual media
        if (webResource.about === aggregation.edmIsShownAt) {
          webResource.isShownAt = true;
        }
      }

      // Crude check for IIIF content, which is to prevent newspapers from showing many
      // IIIF viewers.
      //
      // Also greatly minimises response size, and hydration cost, for IIIF with
      // many web resources, all of which are contained in a single manifest anyway.
      let displayable;
      if (isIIIFPresentation(media[0])) {
        displayable = [media[0]];
      } else if (media.some(isIIIFImage)) {
        displayable = [media.find(isIIIFImage)];
      } else {
        displayable = media;
      }

      // Sort by isNextInSequence property if present
      return sortByIsNextInSequence(displayable).map(Object.freeze);
    },

    /**
     * Get the record data from the API
     * @param {string} europeanaId ID of Europeana record
     * @return {Object} parsed record data
     */
    getRecord(europeanaId, options = {}) {
      let path = '';
      if (!this.$axios.defaults.baseURL.endsWith('/record')) {
        path = '/record';
      }

      const params = { ...this.$axios.defaults.params };
      if (context.$features?.translatedItems) {
        if (options.metadataLanguage) {
          params.profile = 'translate';
          params.lang = options.metadataLanguage;
        }
      } else {
        // No point in switching on experimental schema.org with item translations.
        // The profiles would interfere with each other.
        let schemaOrgDatasetId;
        if (context.$config?.app?.schemaOrgDatasetId) {
          schemaOrgDatasetId = context.$config.app.schemaOrgDatasetId;
        }
        if (schemaOrgDatasetId && europeanaId.startsWith(`/${schemaOrgDatasetId}/`)) {
          params.profile = 'schemaOrg';
        }
      }

      return this.$axios.get(`${path}${europeanaId}.json`, { params })
        .then((response) => {
          const parsed = this.parseRecordDataFromApiResponse(response.data, options);
          const reduced = reduceLangMapsForLocale(parsed, parsed.metadataLanguage || options.locale, { freeze: false });

          // Restore `en` prefLabel on entities, e.g. for use in EntityBestItemsSet-type sets
          for (const entityType of ['agents', 'concepts', 'organizations', 'places', 'timespans']) {
            for (const reducedEntity of (reduced[entityType] || [])) {
              const fullEntity = parsed[entityType].find(entity => entity.about === reducedEntity.about);
              if (fullEntity.prefLabel?.en !== reducedEntity.prefLabel?.en) {
                reducedEntity.prefLabel.en = fullEntity.prefLabel.en;
              }
            }
          }

          return {
            record: reduced,
            error: null
          };
        })
        .catch((error) => {
          const errorResponse = error.response;
          if (errorResponse?.status === 502 && errorResponse?.data.code === '502-TS' && !options.fromTranslationError) {
            delete (options.metadataLanguage);
            options.fromTranslationError = true;
            return this.getRecord(europeanaId, options);
          }
          throw apiError(error, context);
        });
    },

    mediaProxyUrl(mediaUrl, europeanaId, params = {}) {
      if (!params['api_url']) {
        // TODO: it is not ideal to hard-code "/api" here, but the media proxy
        //       expects Record API URLs to end thus, i.e. not /record or /api/v2
        params['api_url'] = new URL(this.$axios.defaults.baseURL).origin + '/api';
      }

      const proxyUrl = new URL(context.$config?.europeana?.proxy?.media?.url || EUROPEANA_MEDIA_PROXY_URL);
      proxyUrl.pathname = europeanaId;
      proxyUrl.searchParams.append('view', mediaUrl);

      for (const name in params) {
        proxyUrl.searchParams.append(name, params[name]);
      }

      return proxyUrl.toString();
    }
  };
};

const reduceEntity = (entity) => {
  return pick(entity, [
    'about',
    'latitude',
    'longitude',
    'prefLabel'
  ]);
};

const reduceWebResource = (webResource) => {
  return pick(webResource, [
    'webResourceEdmRights',
    'about',
    'dctermsIsReferencedBy',
    'ebucoreHasMimeType',
    'ebucoreHeight',
    'ebucoreWidth',
    'edmCodecName',
    'isNextInSequence',
    'svcsHasService'
  ]);
};

/**
 * Tests whether a string is a valid Europeana record ID.
 * @param {string} value Value to test
 * @return {Boolean}
 */
export function isEuropeanaRecordId(value) {
  return /^\/\d+\/\w+$/.test(value);
}

/**
 * Extracts a Record Id from a URL
 * Supported formats:
 *  ID: /90402/SK_A_2344
 *  URI: http://data.europeana.eu/item/90402/SK_A_2344
 *  Website URL: http(s)://www.europeana.eu/($LOCALE/)item/90402/SK_A_2344
 * @param {string} value URL
 * @return {string}
 */
export function recordIdFromUrl(value) {
  const urlMatch = value.match(/(\/\d+\/\w+)($|\?)/);
  return urlMatch?.[1];
}
