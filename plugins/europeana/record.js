import axios from 'axios';
import omitBy from 'lodash/omitBy';

const mime = require('mime-types');

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
    pdfLink: findPDFContent(providerAggregation.edmIsShownBy),
    fields: omitBy({
      dcContributor: providerProxy.dcContributor,
      dcCreator: providerProxy.dcCreator,
      dcDescription: providerProxy.dcDescription,
      dcTitle: providerProxy.dcTitle,
      dcType: providerProxy.dcType,
      dctermsCreated: providerProxy.dctermsCreated,
      edmCountry: europeanaAggregation.edmCountry,
      edmDataProvider: providerAggregation.edmDataProvider,
      edmRights: providerAggregation.edmRights
    }, (v) => {
      return v == null;
    }),
    media: webResources
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
    params: params
  })
    .then((response) => {
      return {
        record: parseRecordDataFromApiResponse(response),
        error: null
      };
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

/**
 * Find the content type of a file and if type is a pdf return the url
 * @param {string} url of a file
 * @return {Object} the url of the file
 */
function findPDFContent(file) {
  if (!file) return;

  const contentType = mime.lookup(file);
  if (contentType && contentType.includes('pdf')) {
    return file;
  } else {
    return;
  }
}

export default getRecord;
