module.exports = function(migration) {
  const contentType = migration.editContentType('staticPage');
  contentType.editField('primaryImageOfPage').omitted(true);
  contentType.deleteField('primaryImageOfPage');
};
