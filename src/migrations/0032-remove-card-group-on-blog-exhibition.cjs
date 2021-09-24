module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting.editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],
      linkType: 'Entry'
    });

  const exhibitionChapterPage = migration.editContentType('exhibitionChapterPage');
  exhibitionChapterPage.editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],
      linkType: 'Entry'
    });
};

