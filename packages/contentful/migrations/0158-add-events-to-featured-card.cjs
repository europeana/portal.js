module.exports = function (migration) {
  const contentHubPage = migration.editContentType('contentHubPage');
  contentHubPage
    .editField('contentTypes')
    .items({
      type: 'Symbol',

      validations: [
        {
          in: ['blog post', 'exhibition', 'project', 'story', 'training', 'event']
        }
      ]
    });

  contentHubPage
    .editField('featuredContent')
    .validations([
      {
        linkContentType: ['blogPosting', 'event', 'exhibitionPage', 'projectPage', 'story']
      }
    ]);
};
