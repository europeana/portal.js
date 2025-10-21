module.exports = function(migration) {
  const contentHubPage = migration.editContentType('contentHubPage');

  contentHubPage
    .createField('featuredContent')
    .name('Featured content')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        // TODO: add training and event when available
        linkContentType: ['blogPosting', 'exhibitionPage', 'project', 'story']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  contentHubPage.changeFieldControl(
    'featuredContent',
    'builtin',
    'entryLinkEditor',
    {}
  );

  const landingPage = migration.editContentType('landingPage');

  landingPage
    .createField('featuredContent')
    .name('Featured content')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['curatedCard']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  landingPage.changeFieldControl(
    'featuredContent',
    'builtin',
    'entryLinkEditor',
    {}
  );
};
