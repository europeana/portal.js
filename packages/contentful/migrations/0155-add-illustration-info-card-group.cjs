module.exports = function(migration) {
  const infoCardGroup = migration.editContentType('infoCardGroup');

  infoCardGroup
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

  infoCardGroup.changeFieldControl('image', 'builtin', 'entryLinkEditor', {});
};
