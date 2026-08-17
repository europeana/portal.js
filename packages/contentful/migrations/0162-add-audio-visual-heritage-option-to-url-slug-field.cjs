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
          'audiovisual-heritage',
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
