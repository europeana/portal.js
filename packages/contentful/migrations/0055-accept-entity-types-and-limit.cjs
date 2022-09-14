module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting
    .editField('relatedLink')
    .validations([
      {
        size: {
          min: null,
          max: 5
        }
      }
    ])
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
};
