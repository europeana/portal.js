const MurmurHash3 = require('imurmurhash');

module.exports = function(migration) {
  migration.transformEntriesToType({
    sourceContentType: 'blogPosting',
    targetContentType: 'story',
    shouldPublish: 'preserve',
    updateReferences: false,
    removeOldEntries: false,
    identityKey(fields) {
      const value = fields.identifier['en-GB'].toString();
      return MurmurHash3(value).result().toString();
    },
    transformEntryForLocale(fromFields, currentLocale) {
      return {
        name: fromFields.name ? fromFields.name[currentLocale] : undefined,
        identifier: fromFields.identifier[currentLocale],
        description: fromFields.description ? fromFields.description[currentLocale] : undefined,
        primaryImageOfPage: fromFields.primaryImageOfPage ? fromFields.primaryImageOfPage[currentLocale] : undefined,
        hasPart: fromFields.hasPart ? fromFields.hasPart[currentLocale] : undefined,
        datePublished: fromFields.datePublished ? fromFields.datePublished[currentLocale] : undefined,
        author: fromFields.author ? fromFields.author[currentLocale] : undefined,
        relatedLink: fromFields.relatedLink ? fromFields.relatedLink[currentLocale] : undefined,
        contentWarning: fromFields.contentWarning ? fromFields.contentWarning[currentLocale] : undefined,
        categories: fromFields.categories ? fromFields.categories[currentLocale] : undefined,
        genre: fromFields.genre ? fromFields.genre[currentLocale] : undefined
      };
    }
  });
};
