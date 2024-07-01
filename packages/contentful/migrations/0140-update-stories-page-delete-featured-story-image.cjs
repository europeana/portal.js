module.exports = function(migration) {
  const storiesPage = migration
    .editContentType('storiesPage');

  storiesPage.deleteField('featuredStoryImage');
};
