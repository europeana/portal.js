const MurmurHash3 = require('imurmurhash');
const staticPages = [
  'about-us',
  'for-developers',
  'help',
  'rights',
  'rights/terms-of-use',
  'rights/api-terms-of-use',
  'rights/usage-guidelines-for-metadata',
  'rights/public-domain-usage-guidelines',
  'rights/europeana-data-sources',
  'rights/terms-for-user-contributions',
  'rights/privacy-policy',
  'rights/accessibility-policy',
  'rights/public-domain-charter'
];

module.exports = (migration) => {
  migration.transformEntriesToType({
    sourceContentType: 'browsePage',
    targetContentType: 'staticPage',
    shouldPublish: true,
    updateReferences: true,
    removeOldEntries: true,
    identityKey(fields) {
      if (fields.identifier && staticPages.includes(fields.identifier['en-GB'])) {
        const value = fields.identifier['en-GB'].toString();
        return MurmurHash3(value).result().toString();
      }
    },
    transformEntryForLocale(fromFields, currentLocale) {
      if (fromFields.identifier && staticPages.includes(fromFields.identifier['en-GB'])) {
        return {
          name: fromFields.name ? fromFields.name[currentLocale] : undefined,
          identifier: fromFields.identifier ? fromFields.identifier[currentLocale] : undefined,
          description: fromFields.description ? fromFields.description[currentLocale] : undefined,
          primaryImageOfPage: fromFields.primaryImageOfPage ? fromFields.primaryImageOfPage[currentLocale] : undefined,
          image: fromFields.image ? fromFields.image[currentLocale] : undefined,
          hasPart: fromFields.hasPart ? fromFields.hasPart[currentLocale] : undefined
        };
      }
    }
  });
};
