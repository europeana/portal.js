
module.exports = function(migration) {
  const project = migration.editContentType('project');

  project.deleteField('reports');
  project.deleteField('factSheet');
};
