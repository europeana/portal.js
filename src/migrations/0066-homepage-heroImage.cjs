module.exports = function(migration) {
  const homePage = migration.editContentType('homePage');

  homePage
    .createField('image')
    .name('Background image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  homePage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
};
