module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');
  browsePage
    .editField('identifier')
    .validations([
      {
        unique: true
      },
      {
        prohibitRegexp: {
          pattern: '^(api$|api/|blog$|blog/|collections/|exhibitions$|exhibitions/|galleries$|galleries/|record/|schemas$|schemas/|search$)',
          flags: null
        },
        message: 'This URL slug is reserved.'
      }
    ]);

  const imageGallery = migration.editContentType('imageGallery');
  imageGallery.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Will always be prefixed with "/galleries/"'
  });

  const exhibitionPage = migration.editContentType('exhibitionPage');
  exhibitionPage.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Will always be prefixed with "/exhibitions/"'
  });

  const exhibitionChapterPage = migration.editContentType('exhibitionChapterPage');
  exhibitionChapterPage.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Will automatically be prefixed with "/exhibitions/EXHIBITION_SLUG/"'
  });
};
