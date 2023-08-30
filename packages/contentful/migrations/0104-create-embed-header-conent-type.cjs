module.exports = async function(migration) {
  // Create embedWithHeader content type

  const embedWithHeader = migration
    .createContentType('embedWithHeader')
    .name('Embed with header')
    .description('Section with a header (background image, title and text) and an embed')
    .displayField('name');

  embedWithHeader
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

  embedWithHeader
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  embedWithHeader.changeFieldControl('text', 'builtin', 'markdown', {
    helpText: 'Text to accompany embed. Currently only used for the embed on Landing pages.'
  });

  embedWithHeader
    .createField('image')
    .name('Background image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  embedWithHeader
    .createField('embed')
    .name('Embed')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['embed']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['infoCardGroup', 'imageCardGroup', 'landingSubSection', 'embedWithHeader']
        }
      ],

      linkType: 'Entry'
    });
};
