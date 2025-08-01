module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const personGroup = migration
    .createContentType('personGroup')
    .name('Person group')
    .description('List of person entity id\'s')
    .displayField('headline');

  personGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  personGroup.changeFieldControl('headline', 'builtin', 'singleLine', {});

  personGroup.createField('hasPart')
    .name('Persons')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 8
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
            pattern: '^http://data.europeana.eu/agent/(base/)?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  personGroup.changeFieldControl('hasPart', 'app', process.env.ENTITY_SUGGEST_APP_ID);
};
