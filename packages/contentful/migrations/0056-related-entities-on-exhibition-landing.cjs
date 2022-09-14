module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const exhibitionPage = migration.editContentType('exhibitionPage');
  exhibitionPage.createField('relatedLink')
    .name('Related entities')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 5
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern: '^http://data.europeana.eu/(agent|concept|timespan|organization)/(base/)?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  exhibitionPage.changeFieldControl('relatedLink', 'app', process.env.ENTITY_SUGGEST_APP_ID);
  exhibitionPage
    .moveField('relatedLink')
    .afterField('credits');
};
