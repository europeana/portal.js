module.exports = function(migration) {
  const entityPage = migration.editContentType('entityPage');
  entityPage.name('Collection Page');
};
