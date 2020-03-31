module.exports = function(migration) {
  const automatedRecordCard = migration.editContentType('automatedRecordCard');

  automatedRecordCard
    .editField('name')
    .localized(false);

  automatedRecordCard
    .editField('creator')
    .disabled(true);

  automatedRecordCard
    .editField('provider')
    .disabled(true);

  automatedRecordCard
    .createField('encoding')
    .name('Encoding')
    .type('Object')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(true)
    .omitted(false);

  automatedRecordCard.changeFieldControl(
    'name',
    'extension',
    'disabledSingleLineText',
    {
      helpText:
        'This field will be automatically set when an item has been harvested.'
    }
  );

  const automatedEntityCard = migration.editContentType('automatedEntityCard');

  automatedEntityCard
    .editField('name')
    .localized(false);

  automatedEntityCard
    .editField('description')
    .disabled(true);

  automatedEntityCard
    .createField('encoding')
    .name('Encoding')
    .type('Object')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(true)
    .omitted(false);

  automatedEntityCard.changeFieldControl(
    'name',
    'extension',
    'disabledSingleLineText',
    {
      helpText:
        'This field will be automatically set when an item has been harvested.'
    }
  );
};
