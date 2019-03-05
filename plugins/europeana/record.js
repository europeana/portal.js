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
  const edmLanguage = europeanaAggregation.edmLanguage['def'][0];

  const webResources = providerAggregation.webResources.map(webResource => {
    return omitBy({
      rdfAbout: webResource.about,
      dcDescription: webResource.dcDescription,
      edmRights: webResource.webResourceEdmRights
    }, (v) => {
      return v == null;
    });
  });

  return {
    image: {
      link: providerAggregation.edmIsShownAt,
      src: europeanaAggregation.edmPreview
    },
    fields: omitBy({
      dcContributor: providerProxy.dcContributor,
      dcCreator: providerProxy.dcCreator,
      dcDescription: providerProxy.dcDescription,
      dcTitle: providerProxy.dcTitle,
      dcType: providerProxy.dcType,
      dctermsCreated: providerProxy.dctermsCreated,
      edmCountry: europeanaAggregation.edmCountry,
      edmDataProvider: providerAggregation.edmDataProvider,
      edmLanguage: edmLanguage,
      edmRights: providerAggregation.edmRights
    }, (v) => {
      return v == null;
    }),
    media: webResources
  };
}

/**
 * Get the record data from the API
 * @param {Object} params parameters used to get the requested record
 * @return {Object} parsed record data
 */
function getRecord(params) {
  return axios.get(`https://api.europeana.eu/api/v2/record${params.europeanaId}.json?wskey=${params.key}`)
    .then((response) => {
      return {
        record: parseRecordDataFromApiResponse(response),
        error: null
      };
    })
    .catch((error) => {
      if (typeof error.response === 'undefined') {
        throw error;
      }
      return {
        error: error.response.data.error,
        record: null
      };
    });
}

export default getRecord;
