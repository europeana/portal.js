module.exports = function(migration) {
  const exhibitionChapterPage = migration.editContentType('exhibitionChapterPage');

  exhibitionChapterPage
    .editField('hasPart')
    .validations([
      {
        linkContentType: [
          'cardGroup',
          'embed',
          'imageComparison',
          'imageWithAttribution',
          'richText'
        ]
      }
    ]);
};
