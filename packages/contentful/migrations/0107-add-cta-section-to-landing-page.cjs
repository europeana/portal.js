module.exports = function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['infoCardGroup', 'imageCardGroup', 'landingSubSection', 'embedSection', 'primaryCallToAction']
        }
      ],

      linkType: 'Entry'
    });
};
