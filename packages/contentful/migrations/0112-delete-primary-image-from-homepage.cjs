module.exports = function(migration) {
  const homePage = migration.editContentType('homePage');

  homePage
    .deleteField('primaryImageOfPage');
};
