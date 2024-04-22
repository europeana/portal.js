module.exports = function(migration) {
  const infoCard = migration.editContentType('infoCard');

  infoCard
    .createField('link')
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

  const embedSection = migration.editContentType('embedSection');

  embedSection
    .createField('link')
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

  const imageCard = migration
    .editContentType('imageCard');

  imageCard
    .editField('name')
    .validations([]);
};
