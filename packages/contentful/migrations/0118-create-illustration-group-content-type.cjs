module.exports = function(migration) {
  const illustrationGroup = migration
    .createContentType('illustrationGroup')
    .name('Illustration group')
    .description('Group of illustrations, each with optional link, no attribution.')
    .displayField('name');

  illustrationGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  illustrationGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  illustrationGroup
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 20
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['illustration']
        }
      ],

      linkType: 'Entry'
    });
};
