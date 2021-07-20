module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .validations([
      {
        size: {
          max: 20
        }
      }
    ]);

  const cardGroup = migration.editContentType('cardGroup');
  cardGroup
    .editField('hasPart')
    .validations([
      {
        size: {
          max: 28
        }
      }
    ]);
};
