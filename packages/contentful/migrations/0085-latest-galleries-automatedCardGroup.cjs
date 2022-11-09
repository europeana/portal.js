module.exports = function(migration) {
  const automatedCardGroup = migration.editContentType('automatedCardGroup');

  automatedCardGroup
    .editField('genre')
    .validations([
      {
        in: [
          'Featured centuries',
          'Featured organisations',
          'Featured places',
          'Featured topics',
          'Item counts by media type',
          'Latest galleries',
          'Recent items'
        ]
      }
    ]);
};
