module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'richText', 'latestCardGroup']
        },
        {
          size: {
            max: 20
          }
        }
      ],
      linkType: 'Entry'
    });


  const cardGroup = migration.editContentType('cardGroup');
  cardGroup
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: [
            'automatedEntityCard',
            'automatedRecordCard',
            'curatedCard'
          ]
        },
        {
          size: {
            max: 20
          }
        }
      ],

      linkType: 'Entry'
    });

};
