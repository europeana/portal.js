module.exports = function(migration) {
  const automatedCardGroup = migration.editContentType('automatedCardGroup');

  automatedCardGroup
    .editField('genre')
    .validations([
      {
        in: ['Featured topics', 'Recent items', 'Featured centuries']
      }
    ]);
};
