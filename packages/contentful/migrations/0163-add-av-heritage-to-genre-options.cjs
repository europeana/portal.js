module.exports = function(migration) {
  for (const contentTypeId of ['exhibitionPage', 'story']) {
    const contentType = migration.editContentType(contentTypeId);

    contentType
      .editField('genre')
      .items({
        type: 'Symbol',
        validations: [
          {
            in: [
              'archaeology',
              'art',
              'audio-visual-heritage',
              'fashion',
              'industrial-heritage',
              'manuscripts',
              'maps-and-geography',
              'migration',
              'music',
              'natural-history',
              'newspapers',
              'photography',
              'sport',
              'world-war-i'
            ]
          }
        ]
      });
  }
};
