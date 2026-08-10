module.exports = function(migration) {
  const themePage = migration.editContentType('themePage');

  themePage
    .editField('identifier')
    .validations([
      {
        unique: true
      },
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
    ]);
};
