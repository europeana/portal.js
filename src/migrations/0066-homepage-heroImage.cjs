module.exports = function(migration) {
  const homePage = migration.editContentType('homePage');

  homePage
    .createField('primaryImageOfPage')
    .name('Background image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  homePage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {}
  );
};
