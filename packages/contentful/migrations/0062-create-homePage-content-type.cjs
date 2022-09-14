module.exports = function (migration) {
  const homePage = migration
    .createContentType('homePage')
    .name('Home Page')
    .description(
      "The home page of the website. If more than one entry exists, that with the most recent 'publish at' date (that has passed) will be used."
    )
    .displayField('name');

  homePage
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  homePage
    .createField('identifier')
    .name('Identifier')
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

  homePage
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  homePage
    .createField('sections')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 3,
        },
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['primaryCallToAction'],
        },
      ],

      linkType: 'Entry',
    });

  homePage.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText:
      'Not displayed on the website, but useful in Contentful to distinguish from other entries.',
  });

  homePage.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText:
      'A unique identifier for this home page. Used only for previewing.',
  });

  homePage.changeFieldControl('datePublished', 'builtin', 'datePicker', {});

  homePage.changeFieldControl('sections', 'builtin', 'entryLinksEditor', {
    helpText:
      'CTAs alternate with coded components like search, themes and latest editorial.',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};
