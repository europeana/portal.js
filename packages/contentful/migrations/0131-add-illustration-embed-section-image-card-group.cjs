module.exports = function(migration) {
  const embedSection = migration.editContentType('embedSection');

  embedSection
    .createField('image')
    .name('Illustration')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['illustration']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  embedSection.changeFieldControl('image', 'builtin', 'entryLinkEditor', {});

  const imageCardGroup = migration.editContentType('imageCardGroup');

  imageCardGroup
    .createField('image')
    .name('Illustration')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['illustration']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  imageCardGroup.changeFieldControl('image', 'builtin', 'entryLinkEditor', {});
};
