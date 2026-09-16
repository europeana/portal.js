module.exports = function(migration) {
  const curatedCard = migration.editContentType('curatedCard');

  curatedCard
    .editField('name')
    .validations([]);

  curatedCard.changeFieldControl('name', 'builtin', 'singleLine', { helpText: '' });

  const automatedEntityCard = migration.editContentType('automatedEntityCard');

  automatedEntityCard
    .editField('name')
    .validations([]);

  automatedEntityCard.changeFieldControl('name', 'builtin', 'singleLine', { helpText: '' });
};
