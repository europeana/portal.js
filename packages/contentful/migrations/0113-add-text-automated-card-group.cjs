module.exports = function(migration) {
  const automatedCardGroup = migration.editContentType('automatedCardGroup');

  automatedCardGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 60
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  automatedCardGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 600
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  automatedCardGroup.changeFieldControl('text', 'builtin', 'markdown', {
    helpText: 'Text to accompany the card group. Currently only displayed on landing pages.'
  });

  automatedCardGroup
    .moveField('headline')
    .toTheTop();

  automatedCardGroup
    .moveField('text')
    .afterField('headline');
};
