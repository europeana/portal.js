module.exports = function(migration) {
  const entityPage = migration.editContentType('entityPage');

  entityPage
    .editField('name')
    .localized(true)
    .validations([
      {
        size: {
          max: 100
        }
      }
    ]);

  entityPage.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'If present, will be used. Otherwise, the title will be read from the API'
  });

  entityPage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  entityPage
    .moveField('description')
    .afterField('identifier');

  entityPage.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'If present, will be used. Otherwise, the description will be read from the API'
  });
};
