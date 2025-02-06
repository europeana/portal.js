module.exports = function (migration) {
  const storiesPage = migration
    .createContentType('storiesPage')
    .name('Stories Page')
    .description(
      'The top-level Stories page.'
    )
    .displayField('name');

  storiesPage
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true,
      },
      {
        size: {
          max: 100,
        },

        message:
          'This is an H1 field, it needs to be unique for SEO and not more than 100 characters.',
      },
    ])
    .disabled(false)
    .omitted(false);

  storiesPage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  storiesPage
    .createField('headline')
    .name('Headline')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  storiesPage
    .createField('image')
    .name('Social media image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
      {
        assetImageDimensions: {
          width: {
            min: 300,
            max: null,
          },

          height: {
            min: 250,
            max: null,
          },
        },

        message: 'Please make sure the image is at least 300x250px',
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  storiesPage
    .createField('featuredStory')
    .name('Featured story')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['story'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  storiesPage
    .createField('featuredStoryImage')
    .name('Featured story image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  storiesPage
    .createField('primaryCallToAction')
    .name('Primary CTA')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['primaryCallToAction'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  storiesPage.changeFieldControl('name', 'builtin', 'singleLine', {});

  storiesPage.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'For SEO, please make sure there is a short description.',
  });

  storiesPage.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'Headline to use on the hero banner.',
  });

  storiesPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  storiesPage.changeFieldControl(
    'featuredStory',
    'builtin',
    'entryLinkEditor',
    {}
  );
  storiesPage.changeFieldControl(
    'featuredStoryImage',
    'builtin',
    'assetLinkEditor',
    {}
  );
  storiesPage.changeFieldControl(
    'primaryCallToAction',
    'builtin',
    'entryLinkEditor',
    {}
  );
};
