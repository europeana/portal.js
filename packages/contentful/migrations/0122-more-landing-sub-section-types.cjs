module.exports = function(migration) {
  const landingSubSection = migration
    .editContentType('landingSubSection');

  landingSubSection
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: [
            'cardGroup',
            'automatedCardGroup',
            'illustrationGroup',
            'infoCardGroup',
            'imageCard'
          ]
        }
      ],

      linkType: 'Entry'
    });
};
