module.exports = function (migration, { makeRequest }) {
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

    // Disable use of old keywords field on exhbitionPage content type
    if (contentTypeName === 'exhibitionPage') {
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

  // 3. Create category entries

  // 4. Link exhibitionPage entries to categories based on keywords
  migration.transformEntries({
    contentType: 'exhibitionPage',
    from: ['keywords'],
    to: ['categories'],
    transformEntryForLocale: async(fields, locale) => {
      if (locale !== 'en-GB') {
        return;
      }

      const categories = [];

      for (const tag of fields.keywords[locale]) {
        // fetch category entries for each keyword
        const response = await makeRequest({
          method: 'GET',
          url: '/entries',
          params: {
            'content_type': 'category',
            name: tag
          }
        });

        // categories.push({
        //   sys: {
        //     type: 'Link',
        //     linkType: 'Entry',
        //     id: categoryId
        //   }
        // });
      }

      return {
        categories: []
      }
    },
    shouldPublish: 'preserve'
  });
};
