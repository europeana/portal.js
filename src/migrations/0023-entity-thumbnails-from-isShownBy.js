require('dotenv').config();

const axios = require('axios');

const entityOrigin = process.env['EUROPEANA_ENTITY_API_ORIGIN'] || 'https://api.europeana.eu';
const apiKey = process.env['EUROPEANA_ENTITY_API_KEY'];

const entityRootUrl = `${entityOrigin}/entity`;

const getEntity = async(identifier) => {
  const url = identifier.replace('http://data.europeana.eu', entityRootUrl) + '.json';

  return axios.get(url, {
    params: {
      wskey: apiKey
    }
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = function(migration) {
  migration.transformEntries({
    contentType: 'automatedEntityCard',
    from: ['identifier'],
    to: ['image'],
    transformEntryForLocale: async(fromFields, currentLocale) => {
      if (currentLocale !== 'en-GB' || !fromFields.identifier) {
        return;
      }

      const identifier = fromFields.identifier[currentLocale];
      const entity = await getEntity(identifier);
      const image = (entity.isShownBy || {}).thumbnail;

      return { image };
    },
    shouldPublish: 'preserve'
  });
};
