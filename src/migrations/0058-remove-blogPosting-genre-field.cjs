module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting.deleteField('genre');
};
