const MurmurHash3 = require('imurmurhash');
const themePages = [
  'http://data.europeana.eu/concept/80',
  'http://data.europeana.eu/concept/190',
  'http://data.europeana.eu/concept/55',
  'http://data.europeana.eu/concept/129',
  'http://data.europeana.eu/concept/17',
  'http://data.europeana.eu/concept/151',
  'http://data.europeana.eu/concept/128',
  'http://data.europeana.eu/concept/62',
  'http://data.europeana.eu/concept/156',
  'http://data.europeana.eu/concept/18',
  'http://data.europeana.eu/concept/48',
  'http://data.europeana.eu/concept/114',
  'http://data.europeana.eu/concept/83'
];

module.exports = (migration) => {
  migration.transformEntriesToType({
    sourceContentType: 'entityPage',
    targetContentType: 'themePage',
    shouldPublish: false,
    updateReferences: false,
    removeOldEntries: false,
    identityKey(fields) {
      if (fields.identifier && themePages.includes(fields.identifier['en-GB'])) {
        const value = fields.identifier['en-GB'].toString();
        return MurmurHash3(value).result().toString();
      }
    },
    transformEntryForLocale(fromFields, currentLocale) {
      if (fromFields.identifier && themePages.includes(fromFields.identifier['en-GB'])) {
        return {
          name: fromFields.name ? fromFields.name[currentLocale] : undefined,
          identifier: fromFields.genre ? fromFields.genre[currentLocale] : undefined,
          entityUri: fromFields.identifier ? fromFields.identifier[currentLocale] : undefined,
          description: fromFields.description ? fromFields.description[currentLocale] : undefined,
          primaryImageOfPage: fromFields.primaryImageOfPage ? fromFields.primaryImageOfPage[currentLocale] : undefined
        };
      }
    }
  });
};
