module.exports = function(migration) {
  const cardGroup = migration.editContentType('cardGroup');

  cardGroup
    .createField('profile')
    .name('Profile')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageDisplayProfile']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  cardGroup.changeFieldControl('profile', 'builtin', 'entryLinkEditor', {});
};
