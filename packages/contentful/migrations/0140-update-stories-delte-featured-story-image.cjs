module.exports = function(migration) {
  const story = migration
    .editContentType('storiesPage');

  story.deleteField('featuredStoryImage');
};
