module.exports = function(migration) {
  for (const contentTypeName of ['blogPosting', 'exhibitionPage']) {
    const contentType = migration.editContentType(contentTypeName);

    contentType
      .editField('relatedLink')
      .items({
        type: 'Symbol',
        validations: [
          {
            regexp: {
              pattern: '^http://data.europeana.eu/(agent|concept|timespan|organization|place)/?[0-9]+$',
              flags: null
            }
          }
        ]
      });
  }
};
