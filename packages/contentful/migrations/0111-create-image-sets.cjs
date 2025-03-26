module.exports = function(migration) {
  const imageSet = migration
    .createContentType('imageSet')
    .name('Image set')
    .description('Set of Images that can be scheduled for use on the homepage')
    .displayField('headline');

  imageSet
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 50
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  imageSet
    .createField('hasPart')
    .name('Images')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 8
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: [
            'imageWithAttribution'
          ]
        }
      ],
      linkType: 'Entry'
    });

  const homePage = migration.editContentType('homePage');

  homePage
    .createField('primaryImageSetOfPage')
    .name('Background images')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: [
            'imageSet'
          ]
        }
      ],
      linkType: 'Entry'
    })
    .disabled(false)
    .omitted(false);

    homePage.changeFieldControl(
      'primaryImageSetOfPage',
      'builtin',
      'entryLinksEditor',
      {
        helpText: 'List of image sets for the background image. The most recently published one will have the images cycled on the homepage. When adding new sets, schedule them for publication, but also make sure this page is republished.'
      }
    );
};
