module.exports = function(migration) {
  const curatedCard = migration.editContentType('curatedCard');

  curatedCard
    .editField('name')
    .validations([
      {
        size: {
          min: 0,
          max: 70
        }
      }
    ]);

  curatedCard.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title can be up to 70 characters long'
  });
};
