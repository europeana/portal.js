module.exports = function(migration) {
  const illustration = migration
    .createContentType('illustration')
    .name('Illustration')
    .description(
      'Illustration used on Call to action banners'
    )
    .displayField('name');

  illustration
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  illustration
    .createField('image')
    .name('Illustration')
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

  illustration.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});

  const primaryCallToAction = migration.editContentType('primaryCallToAction');

  primaryCallToAction
    .createField('image')
    .name('Illustration')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['illustration']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  primaryCallToAction.changeFieldControl('image', 'builtin', 'entryLinkEditor', {});
};
