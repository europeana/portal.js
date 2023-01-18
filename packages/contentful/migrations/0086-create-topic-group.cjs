module.exports = function(migration) {
  const topicGroup = migration
    .createContentType('topicGroup')
    .name('Topic group')
    .description('List of topic entity id\'s')
    .displayField('title');

  topicGroup
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  topicGroup.changeFieldControl('title', 'builtin', 'singleLine', {});

  topicGroup.createField('topics')
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

  topicGroup.changeFieldControl('topics', 'app', process.env.ENTITY_SUGGEST_APP_ID);
};
