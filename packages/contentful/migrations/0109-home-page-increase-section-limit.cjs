module.exports = function(migration) {
  const homePage = migration.editContentType('homePage');

  homePage
    .editField('sections')
    .validations([
      {
        size: {
          min: null,
          max: 3
        }
      }
    ]);
};
