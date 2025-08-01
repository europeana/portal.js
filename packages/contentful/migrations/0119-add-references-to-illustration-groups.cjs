module.exports = function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['cardGroup', 'illustrationGroup', 'infoCardGroup', 'imageCardGroup', 'landingSubSection', 'embedSection', 'primaryCallToAction']
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
          linkContentType: ['automatedCardGroup', 'illustrationGroup', 'infoCardGroup']
        }
      ],

      linkType: 'Entry'
    });
};
