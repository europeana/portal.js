module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'richText', 'latestCardGroup', 'automatedCardGroup', 'primaryCallToAction']
        }
      ],
      linkType: 'Entry'
    });
};
