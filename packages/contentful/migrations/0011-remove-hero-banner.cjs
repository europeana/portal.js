module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('primaryImageOfPage')
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ]);

  migration.deleteContentType('heroBanner');
};
