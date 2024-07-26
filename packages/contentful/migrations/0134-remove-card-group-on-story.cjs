module.exports = function(migration) {
  const story = migration.editContentType('story');
  story.editField('hasPart')
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
