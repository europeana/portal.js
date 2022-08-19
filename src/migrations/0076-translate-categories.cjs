const fs = require('fs');

module.exports = async function (migration) {
  if (!process.env.TAGS_TRANSLATIONS_FILE_NAME) {
    console.error('No tags translations file name specified in TAGS_TRANSLATIONS_FILE_NAME; aborting.');
    process.exit(1);
  }

  const translations = JSON.parse(await fs.readFileSync(process.env.TAGS_TRANSLATIONS_FILE_NAME));

  // 2. Link blogPosting entries to categories & entities
  migration.transformEntries({
    contentType: 'category',
    from: ['name'],
    to: ['name'],
    transformEntryForLocale: async(fields, locale) => {
      if (locale === 'en-GB') {
        return;
      }

      const translation = translations[fields.name['en-GB']];
      if (!translation) {
        process.env.VERBOSE && console.warn(`No translations for ${fields.name['en-GB']}`);
        return;
      }

      const localeTranslation = translation[locale.split('-')[0]];
      if (!localeTranslation) {
        process.env.VERBOSE && console.warn(`No ${locale} translation for ${fields.name['en-GB']}`);
        return;
      }

      process.env.VERBOSE && console.info(`${locale} translation for ${fields.name['en-GB']}: ${localeTranslation}`);

      return {
        name: localeTranslation
      };
    },
    shouldPublish: 'preserve'
  });
};
