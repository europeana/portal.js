module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');

  blogPosting.editField('relatedLink')
    .validations([
      {
        size: {
          min: null,
          max: 3
        }
      }
    ]);
};
