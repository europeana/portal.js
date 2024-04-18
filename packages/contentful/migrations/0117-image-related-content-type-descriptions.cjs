module.exports = function(migration) {
  migration.editContentType('illustration', {
    description: 'Graphical illustration used on CTAs, or in illustration sets. Also used for logos. No attribution. Optional link.'
  });

  migration.editContentType('imageCard', {
    description: 'Card with attributed image. No link.'
  });

  migration.editContentType('imageCardGroup', {
    description: 'Section with text and a group of image cards. Images have attributions.'
  });

  migration.editContentType('imageComparison', {
    description: 'Two images presented for comparison. Images have attributions.'
  });

  migration.editContentType('imageGallery', {
    description: '[DEPRECATED] Formerly, a gallery of images from Europeana items. Superceded by use of the Set API.'
  });

  migration.editContentType('imageSet', {
    description: 'Set of images for scheduling on the homepage. Images have attributions.'
  });
};
