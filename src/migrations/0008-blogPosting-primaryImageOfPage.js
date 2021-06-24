module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting
    .createField('primaryImageOfPage')
    .name('Featured image')
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
  blogPosting
    .moveField('primaryImageOfPage')
    .afterField('description');
};
