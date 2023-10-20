module.exports = async function(migration) {
  // Create embedSection content type

  const embedSection = migration
    .createContentType('embedSection')
    .name('Embed section')
    .description('Section with a header (background image, title and text) and an embed')
    .displayField('name');

  embedSection
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

  embedSection
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  embedSection.changeFieldControl('text', 'builtin', 'markdown', {
    helpText: 'Text to accompany embed. Currently only used for the embed on Landing pages.'
  });

  embedSection
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

  embedSection
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
          linkContentType: ['infoCardGroup', 'imageCardGroup', 'landingSubSection', 'embedSection']
        }
      ],

      linkType: 'Entry'
    });
};
