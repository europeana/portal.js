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

    // Disable use of old keywords field on blogPosting content type
    if (contentTypeName === 'blogPosting') {
      contentType.editField('keywords').disabled(true);
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
      'entryCardsEditor',
      {}
    );
  }
};
