require('dotenv').config();

const contentTypeDefinitions = [
  { id: 'landingPage', sites: ['www.europeana.eu', 'dataspace-culturalheritage.eu'] },
  { id: 'staticPage', sites: ['www.europeana.eu'] },
  { id: 'browsePage', sites: ['www.europeana.eu'] }
];

module.exports = function(migration) {
  if (!process.env.SLUG_VALIDATION_APP_ID) {
    console.log('No app ID specified in SLUG_VALIDATION_APP_ID; aborting.');
    process.exit(1);
  }

  for (const def of contentTypeDefinitions) {
    const contentType = migration.editContentType(def.id);

    contentType
      .createField('site')
      .name('Site')
      .type('Symbol')
      .localized(false)
      .required(true)
      .validations([
        {
          in: def.sites
        }
      ])
      .defaultValue({
        'en-GB': def.sites[0]
      })
      .disabled(false)
      .omitted(false);

    contentType.changeFieldControl('site', 'builtin', 'dropdown');

    contentType.moveField('site').afterField('name');

    contentType.changeFieldControl(
      'identifier',
      'app',
      process.env.SLUG_VALIDATION_APP_ID,
      {
        // Adds ' (per-site) '
        helpText: 'Do not include a leading slash. Should be unique (per-site) for browse, static and landing pages'
      }
    );

    contentType.editField('identifier').validations([
      {
        unique: false
      }
    ]);

    migration.transformEntries({
      contentType: def.id,
      from: ['site'],
      to: ['site'],
      transformEntryForLocale: async(from, locale) => {
        // Don't check from field since it's just been created?
        if (locale !== 'en-GB' || from.site?.[locale]) {
          return;
        }
        return {
          site: def.sites[0]
        };
      }
    });
  }
};
