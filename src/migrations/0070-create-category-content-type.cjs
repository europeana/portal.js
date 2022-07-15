module.exports = function (migration) {
  // 1. Create new content type for Category
  const category = migration
    .createContentType('category')
    .name('Category')
    .description('')
    .displayField('name');

  category
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  category
    .createField('identifier')
    .name('Slug')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  category.changeFieldControl('name', 'builtin', 'singleLine', {});
  category.changeFieldControl('identifier', 'builtin', 'slugEditor', {});

  // 2. Add reference field to blogPosting and exhibitionPage content types
  for (const contentTypeName of ['blogPosting', 'exhibitionPage']) {
    const contentType = migration.editContentType(contentTypeName);

    // Flag on the old keywords field on blogPosting content type that it will
    // no longer be used by the website.
    if (contentTypeName === 'blogPosting') {
      contentType.changeFieldControl('keywords', 'builtin', 'singleLine', {
        helpText: 'NOTE: tags are being replaced by categories and will no longer be displayed by the website'
      });
    }

    contentType
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
    contentType.changeFieldControl(
      'categories',
      'builtin',
      'entryLinkEditor',
      {}
    );
  }
};
