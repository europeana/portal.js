module.exports = function(migration) {
  const latestCardGroup = migration.editContentType('latestCardGroup');

  latestCardGroup
    .editField('genre')
    .validations([
      {
        in: ['Exhibitions', 'Galleries', 'Blog posts']
      },
      {
        unique: true
      }
    ]);
};
