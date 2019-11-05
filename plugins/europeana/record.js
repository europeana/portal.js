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
  const entities = [].concat(edm.concepts, edm.places, edm.agents).filter(checkNotNull);
  const proxyData = merge.all(edm.proxies);

  return {
    altTitle: proxyData.dctermsAlternative,
    description: proxyData.dcDescription,
    identifier: edm.about,
    image: {
      link: providerAggregation.edmIsShownAt,
      src: europeanaAggregation.edmPreview
    },
    coreFields: dereferenceEntities(omitBy({
      dcContributor: proxyData.dcContributor, // Plus rdaGr2DateOfBirth & rdaGr2DateOfDeath
      dcCreator: proxyData.dcCreator, // Plus rdaGr2DateOfBirth & rdaGr2DateOfDeath
      dcPublisher: proxyData.dcPublisher,
      dcSubject: proxyData.dcSubject,
      dcType: proxyData.dcType,
      dcTermsMedium: proxyData.dctermsMedium
    }, checkNull), entities),
    fields: dereferenceEntities(omitBy({
      dcTermsCreated: proxyData.dcTermsCreated,
      edmCountry: europeanaAggregation.edmCountry,
      edmDataProvider: providerAggregation.edmDataProvider,
      edmRights: providerAggregation.edmRights
    }, checkNull), entities),
    media: providerAggregation.webResources.filter((webResource) => {
      return (webResource.about === providerAggregation.edmIsShownBy) ||
        (providerAggregation.hasView || []).includes(webResource.about);
    }),
    agents: edm.agents,
    concepts: edm.concepts,
    title: proxyData.dcTitle
  };
}

function checkNull(value) {
  return value === undefined;
}
function checkNotNull(value) {
  return !checkNull(value);
}

/**
 * Update
 * @param field
 * @param entities
 * @returns {*}
 */
function dereferenceEntities(fields, entities) {
  let returnVal = fields;
  for (const key of Object.keys(returnVal)) {
    // Only look for entities in 'def'
    const fieldValues = returnVal[key]['def'] || [];
    for (const [index, value] of fieldValues.entries()) {
      const matchedEntity = entities.find(entity => {
        return entity.about === value;
      });
      if (matchedEntity) {
        returnVal[key]['def'][index] = matchedEntity;
      }
    }
  }
  return returnVal;
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
