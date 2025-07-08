require('dotenv').config();

module.exports = function(migration) {
  if (!process.env.SLUG_VALIDATION_APP_ID) {
    console.log('No app ID specified in SLUG_VALIDATION_APP_ID; aborting.');
    process.exit(1);
  }
  // Adds ' (per site) '
  const helpText = 'Do not include a leading slash. Should be unique (per site) for browse, static and landing pages';

  const contentTypes = ['landingPage', 'staticPage', 'browsePage'];

  for (const contentType of contentTypes) {
    const currentType = migration
      .editContentType(contentType);

    currentType
      .createField('site')
      .name('Site')
      .type('Symbol')
      .localized(false)
      .required(true)
      .validations([
        {
          in: [
            'www.europeana.eu',
            'dataspace-culturalheritage.eu'
          ]
        }
      ])
      .defaultValue({
        'en-GB': 'www.europeana.eu'
      })
      .disabled(false)
      .omitted(false);

    currentType.changeFieldControl('site', 'builtin', 'dropdown');

    currentType
      .moveField('site')
      .afterField('name');

    currentType.changeFieldControl('identifier', 'app', process.env.SLUG_VALIDATION_APP_ID, {
      helpText,
      contentTypes: 'browsePage,staticPage'
    });

    currentType.editField('identifier')
      .validations([
        {
          unique: false
        }
      ]);

    migration.transformEntries({
      contentType,
      from: ['site'],
      to: ['site'],
      transformEntryForLocale: async(from, locale) => {
        // Don't check from field since it's just been created?
        if (locale !== 'en-GB' || from.site?.[locale]) {
          return;
        }
        return {
          site: 'www.europeana.eu'
        };
      }
    });
  }};
