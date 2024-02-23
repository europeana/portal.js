module.exports = function(migration) {
  const infoCardGroup = migration
    .editContentType('infoCardGroup');

  infoCardGroup.createField('link')
    .name('Link')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['link']
      }
    ])
    .disabled(false)
    .omitted(false);
};
