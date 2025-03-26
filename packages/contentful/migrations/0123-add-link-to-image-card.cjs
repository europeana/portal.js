module.exports = function(migration) {
  const imageCard = migration
    .editContentType('imageCard');

  imageCard.createField('link')
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
