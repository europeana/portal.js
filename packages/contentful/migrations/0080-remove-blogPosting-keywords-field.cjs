module.exports = function(migration) {
  const contentType = migration.editContentType('blogPosting');
  contentType.editField('keywords').omitted(true);
  contentType.deleteField('keywords');
};
