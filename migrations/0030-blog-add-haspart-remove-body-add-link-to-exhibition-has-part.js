module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['cardGroup', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],

      linkType: 'Entry'
    });

  blogPosting.changeFieldControl('hasPart', 'builtin', 'entryCardsEditor', {
    bulkEditing: false
  });

  blogPosting
    .moveField('hasPart')
    .afterField('primaryImageOfPage');

  blogPosting.deleteField('articleBody');

  const exhibitionChapterPage = migration.editContentType('exhibitionChapterPage');

  exhibitionChapterPage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],
      linkType: 'Entry'
    });
};
