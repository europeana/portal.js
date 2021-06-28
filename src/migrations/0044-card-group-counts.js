module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .validations([
      {
        size: {
          max: 20
        }
      }
    ])
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'richText', 'latestCardGroup']
        }
      ],
      linkType: 'Entry'
    });


  const cardGroup = migration.editContentType('cardGroup');
  cardGroup
    .editField('hasPart')
    .validations([
      {
        size: {
          max: 28
        }
      }
    ])
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: [
            'automatedEntityCard',
            'automatedRecordCard',
            'curatedCard'
          ]
        }
      ],

      linkType: 'Entry'
    });

};
