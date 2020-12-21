module.exports = function(migration) {
  const staticPage = migration
    .createContentType('staticPage')
    .name('Static page')
    .description('A static page')
    .displayField('name');

  staticPage
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true
      },
      {
        size: {
          max: 100
        },

        message:
          'This is an H1 field, it needs to be unique for SEO and not more than 100 characters.'
      }
    ])
    .disabled(false)
    .omitted(false);

  staticPage.changeFieldControl('name', 'builtin', 'singleLine', {});

  staticPage
    .createField('identifier')
    .name('URL slug')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  staticPage.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Will always be prefixed with "/pages/"'
  });

  staticPage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .disabled(false)
    .omitted(false);

  staticPage
    .changeFieldControl('description', 'builtin', 'singleLine', {
      helpText: 'For SEO, please make sure there is a short description.'
    });

  staticPage
    .createField('primaryImageOfPage')
    .name('Featured image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  staticPage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {}
  );

  staticPage
    .createField('image')
    .name('Social media image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image']
      },
      {
        assetImageDimensions: {
          width: {
            min: 300,
            max: null
          },

          height: {
            min: 250,
            max: null
          }
        },

        message: 'Please make sure the image is at least 300x250px'
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  staticPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});

  staticPage
    .createField('hasPart')
    .name('Sections')
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
          linkContentType: ['cardGroup', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],

      linkType: 'Entry'
    });

  staticPage
    .createField('relatedPages')
    .name('Related pages')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['linkGroup']
      }
    ]
    )
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};

