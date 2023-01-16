module.exports = function(migration) {
  const personGroup = migration
    .createContentType('personGroup')
    .name('Person group')
    .description('List of person entity id\'s')
    .displayField('title');

  personGroup
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  personGroup.changeFieldControl('title', 'builtin', 'singleLine', {});

  personGroup.createField('persons')
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

  personGroup.changeFieldControl('persons', 'app', process.env.ENTITY_SUGGEST_APP_ID);
};
