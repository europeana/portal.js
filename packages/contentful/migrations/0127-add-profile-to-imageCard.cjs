module.exports = function(migration) {
  const imageCard = migration.editContentType('imageCard');

  imageCard
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

  imageCard.changeFieldControl('profile', 'builtin', 'entryLinkEditor', {});
};
