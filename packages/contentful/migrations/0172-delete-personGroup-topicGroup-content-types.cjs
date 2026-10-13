module.exports = function(migration) {
  const themePage = migration.editContentType('themePage');
  themePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: [
            'galleryGroup',
            'primaryCallToAction',
            'cardGroup',
            'entityGroup'
          ]
        }
      ],
      linkType: 'Entry'
    });

  migration.deleteContentType('personGroup');
  migration.deleteContentType('topicGroup');
};
