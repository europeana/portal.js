const themes = {
  archaeology: 80,
  art: 190,
  fashion: 55,
  industrial: 129,
  manuscript: 17,
  map: 151,
  migration: 128,
  music: 62,
  nature: 156,
  newspaper: 18,
  photography: 48,
  sport: 114,
  ww1: 83
};
const contentTypeName = 'exhibitionPage';

module.exports = function(migration) {
  const contentType = migration.editContentType(contentTypeName);

  contentType
    .createField('genre')
    .name('Themes')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: Object.keys(themes)
        }
      ]
    });

  contentType.changeFieldControl('genre', 'builtin', 'checkbox');

  migration.transformEntries({
    contentType: contentTypeName,
    from: ['relatedLink'],
    to: ['genre', 'relatedLink'],
    transformEntryForLocale: async(fields, locale) => {
      if (locale !== 'en-GB' || !fields.relatedLink) {
        return;
      }

      const genre = [];
      const relatedLink = [];
      for (const category of fields.relatedLink[locale]) {
        const theme = Object.keys(themes).find((theme) => category === `http://data.europeana.eu/concept/${themes[theme]}`);
        if (theme) {
          genre.push(theme);
        } else {
          relatedLink.push(category);
        }
      }

      return {
        genre,
        relatedLink
      };
    },
    shouldPublish: 'preserve'
  });
};
