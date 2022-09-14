module.exports = function (migration) {
  if (!process.env.CATEGORY_SUGGEST_APP_ID) {
    console.log('No app ID specified in CATEGORY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const exhibitionChapterPage = migration.editContentType('exhibitionChapterPage');

  exhibitionChapterPage
    .createField('categories')
    .name('Categories')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['category'],
        },
      ],

      linkType: 'Entry',
    });

  exhibitionChapterPage.changeFieldControl(
    'categories',
    'app',
    process.env.CATEGORY_SUGGEST_APP_ID
  );
};
