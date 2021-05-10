import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import merge from 'deepmerge';

import { apiError, createAxios, reduceLangMapsForLocale } from './utils';
import search from './search';
import { thumbnailUrl, thumbnailTypeForMimeType } from  './thumbnail';
import { getEntityUri, getEntityQuery } from './entity';
import { isIIIFPresentation } from '../media';

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
     * @param {Object} edm data from API response
     * @return {Object} parsed data
     */
    parseRecordDataFromApiResponse(data) {
      const edm = data.object;
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
      const allMediaUris = this.aggregationMediaUris(providerAggregation).map(Object.freeze);

      return {
        allMediaUris,
        altTitle: proxyData.dctermsAlternative,
        description: proxyData.dcDescription,
        identifier: edm.about,
        type: edm.type,
        isShownAt: providerAggregation.edmIsShownAt,
        coreFields: coreFields(proxyData, providerAggregation, entities),
        fields: extraFields(proxyData, edm, entities),
        media: this.aggregationMedia(providerAggregation, allMediaUris, edm.type, edm.services),
        agents,
        concepts,
        timespans,
        title: proxyData.dcTitle,
        schemaOrg: data.schemaOrg
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
          size: 'w200',
          type
        }),
        large: thumbnailUrl(uri, {
          size: 'w400',
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
      const displayable = isIIIFPresentation(media[0]) ? [media[0]] : media;

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

      return this.$axios.get(`${path}${europeanaId}.json`, { params: { profile: 'schemaOrg' } })
        .then(response => this.parseRecordDataFromApiResponse(response.data))
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

const reduceWebResource = (webResource) => {
  return pick(webResource, [
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
  return /^\/[0-9]+\/[a-zA-Z0-9_]+$/.test(value);
}
