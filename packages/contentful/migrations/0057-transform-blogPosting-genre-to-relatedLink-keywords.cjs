const genreToEntity = {
  'archaeology': 'http://data.europeana.eu/concept/base/80',
  'art': 'http://data.europeana.eu/concept/base/190',
  // 'Behind the scenes',
  // 'Competitions',
  // 'European Year Of Cultural Heritage',
  // 'Europeana',
  'europeana 1914-1918': 'http://data.europeana.eu/concept/base/83',
  // 'Europeana 1989',
  'fashion': 'http://data.europeana.eu/concept/base/55',
  // 'Featured',
  'history': 'http://data.europeana.eu/concept/base/79',
  'industrial heritage': 'http://data.europeana.eu/concept/base/129',
  // 'Inspired by Europeana',
  // 'Judaica',
  'manuscripts': 'http://data.europeana.eu/concept/base/17',
  'maps and geography': 'http://data.europeana.eu/concept/base/151',
  'migration': 'http://data.europeana.eu/concept/base/128',
  'music': 'http://data.europeana.eu/concept/base/62',
  'natural history': 'http://data.europeana.eu/concept/base/156',
  // 'News',
  'newspapers': 'http://data.europeana.eu/concept/base/18',
  'photography': 'http://data.europeana.eu/concept/base/48',
  'sport': 'http://data.europeana.eu/concept/base/114'
};

module.exports = function(migration) {
  migration.transformEntries({
    contentType: 'blogPosting',
    from: ['genre', 'relatedLink', 'keywords'],
    to: ['relatedLink', 'keywords'],
    transformEntryForLocale: async(fromFields, currentLocale) => {
      const genres = fromFields.genre?.[currentLocale];
      const relatedLink = fromFields.relatedLink?.[currentLocale] || [];
      const keywords = fromFields.keywords?.[currentLocale] || [];

      if (currentLocale !== 'en-GB' || !genres) {
        return;
      }

      for (const genre of genres) {
        const entity = genreToEntity[genre.toLowerCase()];
        if (entity) {
          if (!relatedLink.includes(entity)) {
            relatedLink.push(entity);
          }
        } else {
          if (!keywords.includes(genre)) {
            keywords.push(genre);
          }
        }
      }

      return {
        relatedLink,
        keywords
      };
    },
    shouldPublish: 'preserve'
  });
};
