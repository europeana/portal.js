module.exports = function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: [
            'cardGroup',
            'embedSection',
            'illustrationGroup',
            'imageCard',
            'imageCardGroup',
            'infoCardGroup',
            'landingSubSection',
            'primaryCallToAction'
          ]
        }
      ],

      linkType: 'Entry'
    });
};
