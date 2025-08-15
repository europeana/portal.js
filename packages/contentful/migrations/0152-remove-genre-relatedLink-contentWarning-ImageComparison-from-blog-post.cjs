module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');

  blogPosting
    .deleteField('genre');
  blogPosting
    .deleteField('relatedLink');
  blogPosting
    .deleteField('contentWarning');
  blogPosting
    .editField('hasPart')
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
