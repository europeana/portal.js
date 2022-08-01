const fs = require('fs');

module.exports = async function (migration, { makeRequest }) {
  if (!process.env.TAGS_TRANSLATIONS_FILE_NAME) {
    console.log('No tags translations file name specified in TAGS_TRANSLATIONS_FILE_NAME; aborting.');
    process.exit(1);
  }

  const tagsTranslations = JSON.parse(await fs.readFileSync(process.env.TAGS_TRANSLATIONS_FILE_NAME));

  migration.transformEntries({
    contentType: 'category',
    from: ['name'],
    to: ['name'],
    transformEntryForLocale: async(fields, locale) => {
      if (locale === 'en-GB') {
        return;
      }

      const localeCode = locale.split('-')[0];
      const englishName = fields.name['en-GB'];
      if (!tagsTranslations[englishName]) {
        console.warn(`${englishName}: [NO TRANSLATIONS]`);
      } else if (tagsTranslations[englishName][localeCode]) {
        // console.log(`${englishName} => ${localeCode}: ${tagsTranslations[englishName][localeCode]}`);
        return {
          name: tagsTranslations[englishName][localeCode]
        };
      } else {
        console.warn(`${englishName} => ${localeCode}: [NOT FOUND]`);
      }
    },
    shouldPublish: 'preserve'
  });
};
