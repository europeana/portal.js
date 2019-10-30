import { apiError } from './utils';
import axios from 'axios';
import omitBy from 'lodash/omitBy';

/**
 * Parse the record data based on the data from the API response
 * @param {Object} response data from API response
 * @return {Object} parsed data
 */
function parseRecordDataFromApiResponse(response) {
  const edm = response.data.object;

  const providerAggregation = edm.aggregations[0];
  const europeanaAggregation = edm.europeanaAggregation;
  const providerProxy = edm.proxies.find((proxy) => {
    return proxy.europeanaProxy === false;
  });

  return {
    altTitle: providerProxy.dctermsAlternative,
    description: providerProxy.dcDescription,
    image: {
      link: providerAggregation.edmIsShownAt,
      src: europeanaAggregation.edmPreview
    },
    fields: omitBy({
      dcContributor: providerProxy.dcContributor,
      dcCreator: providerProxy.dcCreator,
      dcType: providerProxy.dcType,
      dctermsCreated: providerProxy.dctermsCreated,
      edmCountry: europeanaAggregation.edmCountry,
      edmDataProvider: providerAggregation.edmDataProvider,
      edmRights: providerAggregation.edmRights
    }, (v) => {
      return v === null;
    }),
    media: providerAggregation.webResources,
    title: providerProxy.dcTitle,
    edmIsShownBy: providerAggregation.webResources.find((webResource) => {
      return webResource.about === providerAggregation.edmIsShownBy;
    }) || {}
  };
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
