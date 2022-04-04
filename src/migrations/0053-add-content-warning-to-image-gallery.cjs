module.exports = function(migration) {
  const imageGallery = migration.editContentType('imageGallery');

  imageGallery
    .createField('contentWarning')
    .name('Content Warning')
    .type('Link')
    .validations([
        {
          linkContentType: ['contentWarning']
        }
      ])
    .linkType('Entry');
};
