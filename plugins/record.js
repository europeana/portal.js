import axios from 'axios';
import omitBy from 'lodash/omitBy';

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
    error: null,
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

function getRecord(path, key) {
  return axios.get(`https://api.europeana.eu/api/v2/record/${path}.json?wskey=${key}`)
    .then((response) => {
      return parseRecordDataFromApiResponse(response);
    })
    .catch((error) => {
      if (typeof error.response === 'undefined') {
        throw error;
      }
      return {
        error: error.response.data.error
      };
    });
}

export default getRecord;
