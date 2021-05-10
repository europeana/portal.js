module.exports = function(migration) {
  const linkGroup = migration.editContentType('linkGroup');

  linkGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 100
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  linkGroup.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: ''
  });

  linkGroup
    .moveField('name')
    .toTheTop();
};
