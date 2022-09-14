require('dotenv').config();

if (!process.env.SLUG_VALIDATION_APP_ID) {
  console.log('No app ID specified in SLUG_VALIDATION_APP_ID; aborting.');
  process.exit(1);
}

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
    .required(true)
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
    ])
    .disabled(false)
    .omitted(false);

  // "Slug validation - Europeana" app (pre-installed in space & env)
  staticPage.changeFieldControl('identifier', 'app', process.env.SLUG_VALIDATION_APP_ID, {
    helpText: 'Do not include a leading slash. The homepage has slug "home". Should be unique for both browse and static pages',
    contentTypes: 'browsePage'
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
    .validations([
      {
        size: {
          max: 40
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],

      linkType: 'Entry'
    });

  staticPage
    .createField('relatedLinks')
    .name('Related links')
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
