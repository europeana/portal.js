module.exports = function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['infoCardGroup', 'imageCard', 'imageCardGroup', 'landingSubSection', 'embedSection', 'primaryCallToAction']
        }
      ],

      linkType: 'Entry'
    });
};
