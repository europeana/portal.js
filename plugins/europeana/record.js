import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import merge from 'deepmerge';

import { apiError, createAxios, reduceLangMapsForLocale } from './utils';
import search from './search';
import { getEntityUri, getEntityQuery } from './entity';
import webResources from './record/web-resources';

export const BASE_URL = process.env.EUROPEANA_RECORD_API_URL || 'https://api.europeana.eu/record';

/**
 * Retrieves the "Core" fields which will always be displayed on record pages.
 *
 * @param {Object[]} proxyData All core fields are in the proxyData.
 * @param {Object[]} providerAggregation Extra fields used for the provider name & isShownAt link.
 * @param {Object[]} entities Entities in order to perform entity lookups
 * @return {Object[]} Key value pairs of the metadata fields.
 */
function coreFields(proxyData, providerAggregation, entities) {
  return Object.freeze(lookupEntities(omitBy({
    edmDataProvider: { url: providerAggregation.edmIsShownAt, value: providerAggregation.edmDataProvider },
    dcContributor: proxyData.dcContributor,
    dcCreator: proxyData.dcCreator,
    dcPublisher: proxyData.dcPublisher,
    dcSubject: proxyData.dcSubject,
    dcType: proxyData.dcType,
    dctermsMedium: proxyData.dctermsMedium
  }, isUndefined), entities));
}

const PROXY_EXTRA_FIELDS = [
  'dcRights',
  'dcPublisher',
  'dctermsCreated',
  'dcDate',
  'dctermsIssued',
  'dctermsPublished',
  'dctermsTemporal',
  'dcCoverage',
  'dctermsSpatial',
  'edmCurrentLocation',
  'dctermsProvenance',
  'dcSource',
  'dcIdentifier',
  'dctermsExtent',
  'dcDuration',
  'dcMedium',
  'dcFormat',
  'dcLanguage',
  'dctermsIsPartOf',
  'dcRelation',
  'dctermsReferences',
  'dctermsHasPart',
  'dctermsHasVersion',
  'dctermsIsFormatOf',
  'dctermsIsReferencedBy',
  'dctermsIsReplacedBy',
  'dctermsIsRequiredBy',
  'edmHasMet',
  'edmIncorporates',
  'edmIsDerivativeOf',
  'edmIsRepresentationOf',
  'edmIsSimilarTo',
  'edmIsSuccessorOf',
  'edmRealizes',
  'wasPresentAt'
];

/**
 * Retrieves all additional fields which will be displayed on record pages in the collapsable section.
 *
 * @param {Object[]} proxy To take the fields from.
 * @param {Object[]} edm To take additional fields from.
 * @param {Object[]} entities Entities in order to perform entity lookups
 * @return {Object[]} Key value pairs of the metadata fields.
 */
function extraFields(proxy, edm, entities) {
  return Object.freeze(lookupEntities(omitBy({
    ...pick(edm.aggregations[0], [
      'edmProvider', 'edmIntermediateProvider', 'edmRights', 'edmUgc'
    ]),
    ...pick(proxy, PROXY_EXTRA_FIELDS),
    edmCountry: edm.europeanaAggregation.edmCountry,
    europeanaCollectionName: edm.europeanaCollectionName,
    timestampCreated: edm.timestamp_created,
    timestampUpdate: edm.timestamp_update
  }, isUndefined), entities));
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
  for (const [index, value] of (fields[key]['def'] || []).entries()) {
    if (entities[value]) {
      fields[key]['def'][index] = entities[value];
    }
  }
}

export default (context = {}) => {
  const $axios = createAxios({ id: 'record', baseURL: BASE_URL }, context);

  return {
    $axios,

    search(params, options = {}) {
      return search($axios, params, options);
    },

    /**
     * Parse the record data based on the data from the API response
     * @param {Object} response data from API response
     * @return {Object} parsed data
     */
    parseRecordDataFromApiResponse(edm) {
      const providerAggregation = edm.aggregations[0];

      const concepts = (edm.concepts || []).map(reduceEntity).map(Object.freeze);
      const places = (edm.places || []).map(reduceEntity).map(Object.freeze);
      const agents = (edm.agents || []).map(reduceEntity).map(Object.freeze);
      const timespans = (edm.timespans || []).map(reduceEntity).map(Object.freeze);

      const entities = [].concat(concepts, places, agents, timespans)
        .filter(isNotUndefined)
        .reduce((memo, entity) => {
          memo[entity.about] = entity;
          return memo;
        }, {});
      const proxyData = merge.all(edm.proxies);

      return {
        altTitle: proxyData.dctermsAlternative,
        description: proxyData.dcDescription,
        identifier: edm.about,
        type: edm.type,
        isShownAt: providerAggregation.edmIsShownAt,
        coreFields: coreFields(proxyData, providerAggregation, entities),
        fields: extraFields(proxyData, edm, entities),
        media: webResources(edm),
        agents,
        concepts,
        timespans,
        title: proxyData.dcTitle
      };
    },

    /**
     * Get the record data from the API
     * @param {string} europeanaId ID of Europeana record
     * @return {Object} parsed record data
     */
    getRecord(europeanaId, options = {}) {
      let path = '';
      if (!this.$axios.defaults.baseURL.endsWith('/record')) path = '/record';

      return this.$axios.get(`${path}${europeanaId}.json`)
        .then(response => this.parseRecordDataFromApiResponse(response.data.object))
        .then(parsed => reduceLangMapsForLocale(parsed, options.locale))
        .then(reduced => ({
          record: reduced,
          error: null
        }))
        .catch((error) => {
          throw apiError(error);
        });
    },

    /**
     * Search for specific facets for this entity to find the related entities
     * @param {string} type the type of the entity
     * @param {string} id the id of the entity, (can contain trailing slug parts as these will be normalized)
     * @return {Object} related entities
     * TODO: add people as related entities again
     * TODO: use search() function?
     */
    relatedEntities(type, id) {
      const entityUri = getEntityUri(type, id);

      return this.$axios.get('search.json', {
        params: {
          ...this.$axios.defaults.params,
          profile: 'facets',
          facet: 'skos_concept',
          query: getEntityQuery(entityUri),
          rows: 0
        }
      })
        .then(response => response.data.facets)
        .catch(error => {
          const message = error.response ? error.response.data.error : error.message;
          throw new Error(message);
        });
    },

    mediaProxyUrl(mediaUrl, europeanaId, params = {}) {
      if (!params['api_url']) {
        // TODO: it is not ideal to hard-code "/api" here, but the media proxy
        //       expects Record API URLs to end thus, i.e. not /record or /api/v2
        params['api_url'] = new URL(this.$axios.defaults.baseURL).origin + '/api';
      }

      const proxyUrl = new URL('https://proxy.europeana.eu');
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

/**
 * Tests whether a string is a valid Europeana record ID.
 * @param {string} value Value to test
 * @return {Boolean}
 */
export function isEuropeanaRecordId(value) {
  return /^\/[0-9]+\/[a-zA-Z0-9_]+$/.test(value);
}
