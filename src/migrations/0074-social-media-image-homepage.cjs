module.exports = function(migration) {
  const homePage = migration.editContentType('homePage');

  homePage
    .createField('image')
    .name('Social media image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image']
      },
      {
        assetImageDimensions: {
          width: {
            min: 300,
            max: null
          },

          height: {
            min: 250,
            max: null
          }
        },

        message: 'Please make sure the image is at least 300x250px'
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  homePage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
};
