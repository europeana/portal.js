module.exports = function(migration) {
  const automatedEntityCard = migration.editContentType('automatedEntityCard');
  automatedEntityCard
    .editField('name')
    .validations([
      {
        size: {
          min: 0,
          max: 35
        }
      }
    ]);

  automatedEntityCard
    .editField('description')
    .validations([
      {
        size: {
          min: 0,
          max: 120
        }
      }
    ]);

  automatedEntityCard.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title can be up to 35 characters long'
  });

  automatedEntityCard.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'The description can be up to 120 characters long'
  });

  const curatedCard = migration.editContentType('curatedCard');
  curatedCard
    .editField('name')
    .validations([
      {
        size: {
          min: 0,
          max: 35
        }
      }
    ]);

  curatedCard
    .editField('description')
    .validations([
      {
        size: {
          min: 0,
          max: 120
        }
      }
    ]);

  curatedCard.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title can be up to 35 characters long'
  });

  curatedCard.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'The description can be up to 120 characters long'
  });
};
