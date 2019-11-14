import { apiError } from './utils';
import axios from 'axios';
import omitBy from 'lodash/omitBy';
import merge from 'deepmerge';

/**
 * Parse the record data based on the data from the API response
 * @param {Object} response data from API response
 * @return {Object} parsed data
 */
function parseRecordDataFromApiResponse(response) {
  const edm = response.data.object;

  const providerAggregation = edm.aggregations[0];
  const europeanaAggregation = edm.europeanaAggregation;
  const entities = [].concat(edm.concepts, edm.places, edm.agents)
    .filter(isNotUndefined)
    .reduce((memo, entity) => {
      memo[entity.about] = entity;
      return memo;
    }, {});
  const proxyData = merge.all(edm.proxies);

  return {
    altTitle: proxyData.dcTermsAlternative,
    description: proxyData.dcDescription,
    identifier: edm.about,
    image: {
      link: providerAggregation.edmIsShownAt,
      src: europeanaAggregation.edmPreview
    },
    coreFields: lookupEntities(omitBy({
      dcContributor: proxyData.dcContributor, // Plus rdaGr2DateOfBirth & rdaGr2DateOfDeath
      dcCreator: proxyData.dcCreator, // Plus rdaGr2DateOfBirth & rdaGr2DateOfDeath
      dcPublisher: proxyData.dcPublisher,
      dcSubject: proxyData.dcSubject,
      dcType: proxyData.dcType,
      dcTermsMedium: proxyData.dcTermsMedium
    }, isUndefined), entities),
    fields: lookupEntities(omitBy({
      dcTermsCreated: proxyData.dcTermsCreated,
      edmCountry: europeanaAggregation.edmCountry,
      edmDataProvider: providerAggregation.edmDataProvider,
      edmRights: providerAggregation.edmRights,
      dcRights: proxyData.dcRights,
      dcDate: proxyData.dcDate,
      dcTermsIssued: proxyData.dcTermsIssued,
      timespans: edm.timespans,
      dcTermsPublished: proxyData.dcTermsPublished,
      dcTermsTemporal: proxyData.dcTermsTemporal,
      dcCoverage: proxyData.dcCoverage,
      dcTermsTOC: proxyData.dcTermsTOC,
      dcTermsSpacial: proxyData.dcTermsSpatial,
      edmCurentLocation: proxyData.edmCurrentLocation,
      edmUgc: providerAggregation.edmUgc,
      dcTermsProvenance: proxyData.dcTermsProvenance,
      dcSource: proxyData.dcSource,
      dcPublisher: proxyData.dcPublisher,
      dcIdentifier: proxyData.dcIdentifier,
      edmIntermediateProvider: providerAggregation.edmIntermediateProvider,
      edmProvider: providerAggregation.edmProvider,
      timestampCreated: edm.timestamp_created,
      timestampUpdated: edm.timestamp_updated,
      dcTermsExtent: proxyData.dcTermsExtent,
      dcDuration: proxyData.dcDuration,
      dcMedium: proxyData.dcMedium,
      dcFormat: proxyData.dcFormat,
      dcLanguage: proxyData.dcLanguage,
      dcTermsIsPartOf: proxyData.dcTermsIsPartOf,
      europeanaCollectionName: edm.europeanaCollectionName,
      dcRelation: proxyData.dcRelation,
      dcTermsReferences: proxyData.dcTermsReferences,
      dcTermsHasPart: proxyData.dcTermsHasPart,
      dcTermsHasVersion: proxyData.dcTermsHasVersion,
      dcTermsIsFormatOf: proxyData.dcTermsIsFormatOf,
      dcTermsIsReferencedBy: proxyData.dcTermsIsReferencedBy,
      dcTermsIsReplacedBy: proxyData.dcTermsIsReplacedBy,
      dcTermsIsRequiredBy: proxyData.dcTermsIsRequiredBy,
      edmHasMet: proxyData.edmHasMet,
      edmIncorporates: proxyData.edmIncorporates,
      edmIsDerivativeOf: proxyData.edmIsDerivativeOf,
      edmIsRepresentationOf: proxyData.edmIsRepresentationOf,
      edmIsSimilarTo: proxyData.edmIsSimilarTo,
      edmIsSuccessorOf: proxyData.edmIsSuccessorOf,
      edmRealizes: proxyData.edmRealizes,
      wasPresentAt: proxyData.wasPresentAt
    }, isUndefined), entities),
    media: providerAggregation.webResources.filter((webResource) => {
      return (webResource.about === providerAggregation.edmIsShownBy) ||
        (providerAggregation.hasView || []).includes(webResource.about);
    }),
    agents: edm.agents,
    concepts: edm.concepts,
    title: proxyData.dcTitle
  };
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

/**
 * Get the record data from the API
 * @param {string} europeanaId ID of Europeana record
 * @param {Object} params additional parameters sent to the API
 * @param {string} params.wskey API key
 * @return {Object} parsed record data
 */
function getRecord(europeanaId, params) {
  return axios.get(`https://api.europeana.eu/api/v2/record${europeanaId}.json`, {
    params
  })
    .then((response) => {
      return {
        record: parseRecordDataFromApiResponse(response),
        error: null
      };
    })
    .catch((error) => {
      throw apiError(error);
    });
}

/**
 * Tests whether a string is a valid Europeana record ID.
 * @param {string} value Value to test
 * @return {Boolean}
 */
export function isEuropeanaRecordId(value) {
  return /^\/[0-9]+\/[a-zA-Z0-9_]+$/.test(value);
}

export default getRecord;
