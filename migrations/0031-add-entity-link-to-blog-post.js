module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting.createField('relatedLink')
    .name('Related entities')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 2
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
};
