module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const topicGroup = migration
    .createContentType('topicGroup')
    .name('Topic group')
    .description('List of topic entity id\'s')
    .displayField('headline');

  topicGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  topicGroup.changeFieldControl('headline', 'builtin', 'singleLine', {});

  topicGroup.createField('hasPart')
    .name('Topics')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 9
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
            pattern: '^http://data.europeana.eu/concept/(base/)?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  topicGroup.changeFieldControl('hasPart', 'app', process.env.ENTITY_SUGGEST_APP_ID);
};
