module.exports = function(migration) {
  const contentType = migration.editContentType('browsePage');
  contentType.editField('primaryImageOfPage').omitted(true);
  contentType.deleteField('primaryImageOfPage');
};
