const MurmurHash3 = require('imurmurhash');

module.exports = async function(migration, { makeRequest }) {
  // 1. fetch category entries
  const response = await makeRequest({
    method: 'GET',
    url: '/entries',
    params: {
      'content_type': 'category',
      limit: 1000
    }
  });

  const categoryIds = response.items.map((item) => item.sys.id);

  // 2. create story entries from blog post entries
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
      // filter out missing categories
      const categories = fromFields.categories?.[currentLocale]
        ?.filter((category) => categoryIds.includes(category.sys.id))

      return {
        name: fromFields.name?.[currentLocale],
        identifier: fromFields.identifier[currentLocale],
        description: fromFields.description?.[currentLocale],
        primaryImageOfPage: fromFields.primaryImageOfPage?.[currentLocale],
        hasPart: fromFields.hasPart?.[currentLocale],
        datePublished: fromFields.datePublished?.[currentLocale],
        author: fromFields.author?.[currentLocale],
        relatedLink: fromFields.relatedLink?.[currentLocale],
        contentWarning: fromFields.contentWarning?.[currentLocale],
        categories,
        genre: fromFields.genre?.[currentLocale]
      };
    }
  });
};
