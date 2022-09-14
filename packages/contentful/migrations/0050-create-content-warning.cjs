module.exports = function(migration) {
  const contentWarning = migration
    .createContentType('contentWarning')
    .name('Content Warning')
    .description('A warning message to display on blogs/exhibitions.')
    .displayField('name');

  contentWarning
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

    contentWarning
      .createField('description')
      .name('Description')
      .type('Symbol')
      .localized(true)
      .required(true)
      .disabled(false)
      .omitted(false);

  const blogPosting = migration.editContentType('blogPosting');

  blogPosting
    .createField('contentWarning')
    .name('Content Warning')
    .type('Link')
    .validations([
        {
          linkContentType: ['contentWarning']
        }
      ])
    .linkType('Entry');

  const exhibitionPage = migration.editContentType('exhibitionPage');

  exhibitionPage
    .createField('contentWarning')
    .name('Content Warning')
    .type('Link')
    .validations([
        {
          linkContentType: ['contentWarning']
        }
      ])
    .linkType('Entry');
};
