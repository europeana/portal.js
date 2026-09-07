
module.exports = function(migration) {
  const contentHubPage = migration.editContentType('contentHubPage');

  contentHubPage
    .deleteField('featuredContent');
};
