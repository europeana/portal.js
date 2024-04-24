import pick from 'lodash/pick.js';
import md5 from 'md5';
import merge from 'deepmerge';

import EuropeanaApi from './apis/base.js';

import { undefinedLocaleCodes } from './utils.js';
import {
  forEachLangMapValue, reduceLangMapsForLocale, isLangMap
} from './utils.js';
import search from './search.js';
import Item from './edm/Item.js';

import { ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX } from './data.js';
import EuropeanaMediaProxyApi from './media-proxy.js';

const MAX_VALUES_PER_PROXY_FIELD = 10;

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

export default class EuropeanaRecordApi extends EuropeanaApi {
  static ID = 'record';
  static BASE_URL = 'https://api.europeana.eu/record';
  static AUTHENTICATING = true;
  static AUTHORISING = true;

  get search() {
    return search.bind(this);
  }

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
    });
  }

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

    // Europeana proxy only really needed for the translate profile
    const europeanaProxy = findProxy(edm.proxies, 'europeana');
    if (!(this.context?.$features?.translatedItems && options.metadataLanguage)) {
      forEachLangMapValue(europeanaProxy, (europeanaProxy, field, locale) => {
        if (!undefinedLocaleCodes.includes(locale)) {
          delete europeanaProxy[field][locale];
        }
      });
    }
    const aggregatorProxy = findProxy(edm.proxies, 'aggregator');
    const providerProxy = findProxy(edm.proxies, 'provider');

    const proxies = merge.all([europeanaProxy, aggregatorProxy, providerProxy].filter((p) => !!p));

    forEachLangMapValue(proxies, (proxies, field, locale) => {
      if (Array.isArray(proxies[field][locale]) && proxies[field][locale].length > MAX_VALUES_PER_PROXY_FIELD) {
        proxies[field][locale] = proxies[field][locale].slice(0, MAX_VALUES_PER_PROXY_FIELD).concat('…');
      }
    });

    let prefLang;
    if (this.context?.$features?.translatedItems) {
      prefLang = options.metadataLanguage ? options.metadataLanguage : null;
    }
    const predictedUiLang = prefLang || options.locale;

    for (const field in proxies) {
      if (aggregatorProxy?.[field] && localeSpecificFieldValueIsFromEnrichment(field, aggregatorProxy, providerProxy, predictedUiLang, entities)) {
        proxies[field].translationSource = 'enrichment';
      } else if (europeanaProxy?.[field]?.[predictedUiLang] && this.context?.$features?.translatedItems) {
        proxies[field].translationSource = 'automated';
      }
    }

    const metadata = {
      ...lookupEntities(
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
      fromTranslationError: options.fromTranslationError,
      identifier: edm.about,
      type: edm.type, // TODO: Evaluate if this is used, if not remove.
      isShownAt: item.providerAggregation.edmIsShownAt,
      metadata: Object.freeze(metadata),
      media: item.providerAggregation.displayableWebResources,
      agents,
      concepts,
      timespans,
      organizations,
      places,
      title: proxies.dcTitle,
      metadataLanguage: prefLang,
      iiifPresentationManifest: item.iiifPresentationManifest
    };
  }

  /**
   * Get the record data from the API
   * @param {string} europeanaId ID of Europeana record
   * @return {Object} parsed record data
   */
  getRecord(europeanaId, options = {}) {
    let path = '';
    if (!this.axios.defaults.baseURL.endsWith('/record')) {
      path = '/record';
    }

    const params = { ...this.axios.defaults.params };
    if (this.context?.$features?.translatedItems) {
      if (options.metadataLanguage) {
        params.profile = 'translate';
        params.lang = options.metadataLanguage;
      }
    }

    return this.axios.get(`${path}${europeanaId}.json`, { params })
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
        throw this.apiError(error);
      });
  }

  // TODO: move to media-proxy.js
  mediaProxyUrl(mediaUrl, europeanaId, params = {}) {
    params.recordApiUrl = this.baseURL;

    const proxyUrl = new URL(this.context?.$apis?.mediaProxy?.baseURL || EuropeanaMediaProxyApi.BASE_URL);

    proxyUrl.pathname = `${proxyUrl.pathname}${europeanaId}/${md5(mediaUrl)}`;
    if (proxyUrl.pathname.startsWith('//')) {
      proxyUrl.pathname = proxyUrl.pathname.slice(1);
    }

    for (const name in params) {
      proxyUrl.searchParams.append(name, params[name]);
    }

    return proxyUrl.toString();
  }
}

const reduceEntity = (entity) => {
  return pick(entity, [
    'about',
    'latitude',
    'longitude',
    'prefLabel'
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
  const urlMatch = /(\/\d+\/\w+)($|\?)/.exec(value);
  return urlMatch?.[1];
}
