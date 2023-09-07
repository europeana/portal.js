module.exports = async function(migration) {
  const illustration = migration
    .editContentType('illustration');

  // Revert changes to the illustration content type which will no longer be used for landing pages
  illustration
    .deleteField('text');

  illustration
    .description('Illustration used on Call to action banners');

  // Create info card to replace illustration and to be used by landing page
  const infoCard = migration
    .createContentType('infoCard')
    .name('Info card')
    .description('Card with possible asset and text')
    .displayField('name');

  infoCard
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  infoCard
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  infoCard
    .createField('image')
    .name('Image')
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

  infoCard.changeFieldControl('image', 'builtin', 'assetLinkEditor', {
    helpText: 'Preferably use visuals like an icon or logo. Otherwise consider using the curated or image card.'
  });

  // Create infoCard group to replace illustrationCardGroup and be used by landing page
  const infoCardGroup = migration
    .createContentType('infoCardGroup')
    .name('Info card group')
    .description('Section with text and grouped info cards')
    .displayField('name');

  infoCardGroup
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  infoCardGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  infoCardGroup
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 12
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['infoCard']
        }
      ],

      linkType: 'Entry'
    });

  const landingSubSection = migration
    .editContentType('landingSubSection');

  landingSubSection
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['automatedCardGroup', 'infoCardGroup']
        }
      ],

      linkType: 'Entry'
    });

  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['infoCardGroup', 'imageCardGroup', 'landingSubSection', 'embed']
        }
      ],

      linkType: 'Entry'
    });

  migration.deleteContentType('illustrationGroup');
};
