module.exports = function(migration) {
  const automatedCardGroup = migration
    .createContentType('automatedCardGroup')
    .name('Automated card group')
    .description('Various groups of cards automatically populated and regularly rotated.')
    .displayField('genre');

  automatedCardGroup
    .createField('genre')
    .name('Category')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['Featured topics', 'Recent items']
      },
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  automatedCardGroup.changeFieldControl('genre', 'builtin', 'radio', {});

  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'richText', 'latestCardGroup', 'automatedCardGroup']
        }
      ],
      linkType: 'Entry'
    });
};
