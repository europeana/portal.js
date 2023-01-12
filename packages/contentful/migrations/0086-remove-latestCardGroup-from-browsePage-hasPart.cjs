module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'richText', 'automatedCardGroup', 'primaryCallToAction']
        }
      ],
      linkType: 'Entry'
    });
};
