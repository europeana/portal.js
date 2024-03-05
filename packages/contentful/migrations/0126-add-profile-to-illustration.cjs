module.exports = function(migration) {
  const illustration = migration.editContentType('illustration');

  illustration
    .createField('profile')
    .name('Profile')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageDisplayProfile'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  illustration.changeFieldControl('profile', 'builtin', 'entryLinkEditor', {});
};
