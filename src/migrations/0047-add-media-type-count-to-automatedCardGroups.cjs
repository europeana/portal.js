module.exports = function(migration) {
  const automatedCardGroup = migration.editContentType('automatedCardGroup');

  automatedCardGroup
    .editField('genre')
    .validations([
      {
        in: ['Featured topics', 'Recent items', 'Featured centuries', 'Item counts by Media type']
      }
    ]);

  const staticPage = migration.editContentType('staticPage');
  staticPage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText', 'automatedCardGroup']
        }
      ],
      linkType: 'Entry'
    });
};
