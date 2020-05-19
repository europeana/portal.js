require('dotenv').config();

const axios = require('axios');

const recordOrigin = 'https://api.europeana.eu/record';
const apiKey = process.env['EUROPEANA_RECORD_API_KEY'];

const getRecord = async(identifier) => {
  const url = recordOrigin + '/search.json?profile=minimal&query=europeana_id%3A%22' + identifier + '%22&rows=1';
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

module.exports = async function(migration) {
  migration.transformEntries({
    contentType: 'automatedRecordCard',
    from: ['identifier', 'encoding'],
    to: ['encoding'],
    transformEntryForLocale: async(fromFields, currentLocale) => {

      if (currentLocale !== 'en-GB' || !fromFields.identifier) return;
      if (fromFields.encoding) return;

      const record = await getRecord(fromFields.identifier[currentLocale]);
      if (record.itemsCount === 1 && record.items) {
        const encoding = record.items[0];
        return { encoding };
      }
      return;
    },
    shouldPublish: 'preserve'
  });
};
