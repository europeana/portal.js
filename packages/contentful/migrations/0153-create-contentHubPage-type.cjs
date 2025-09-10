require('dotenv').config();

const identifierFieldHelpText = 'Do not include a leading slash. Should be unique (per-site) for browse, static, landing and content hub pages.';
const nameFieldValidations = [
  {
    size: {
      max: 100,
    },
    message:
      'This is an H1 field, it needs to be not more than 100 characters.',
  },
  {
    unique: false,
  }
];

module.exports = function (migration) {
  if (!process.env.SLUG_VALIDATION_APP_ID) {
    console.log('No app ID specified in SLUG_VALIDATION_APP_ID; aborting.');
    process.exit(1);
  }

  const contentHubPage = migration
    .createContentType('contentHubPage')
    .name('Content Hub Page')
    .description(
      'A content hub page acts as an entry point to browse and search entries of one or more content types, with pagination and tags.'
    )
    .displayField('name');

  contentHubPage
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations(nameFieldValidations)
    .disabled(false)
    .omitted(false);

  contentHubPage
    .createField('site')
    .name('Site')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['dataspace-culturalheritage.eu', 'europeana.eu'],
      },
    ])
    .disabled(false)
    .omitted(false);

  contentHubPage
    .createField('identifier')
    .name('URL slug')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  contentHubPage
    .createField('headline')
    .name('Headline')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  contentHubPage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  contentHubPage
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

  contentHubPage
    .createField('contentTypes')
    .name('Content types')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: ['Blog Post', 'Exhibition', 'Project', 'Story'],
        },
      ],
    });

  contentHubPage
    .createField('primaryImageOfPage')
    .name('Featured image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageWithAttribution'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  contentHubPage
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
          linkContentType: ['primaryCallToAction'],
        },
      ],

      linkType: 'Entry',
    });

  contentHubPage.changeFieldControl('name', 'builtin', 'singleLine', {});
  contentHubPage.changeFieldControl('site', 'builtin', 'dropdown', {});

  contentHubPage.changeFieldControl(
    'identifier',
    'app',
    process.env.SLUG_VALIDATION_APP_ID,
    {
      contentTypes: 'landingPage,browsePage,staticPage',
      helpText: identifierFieldHelpText,
    }
  );

  contentHubPage.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'Headline to use on the hero banner.',
  });

  contentHubPage.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'For SEO, please make sure there is a short description.',
  });

  contentHubPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});

  contentHubPage.changeFieldControl('contentTypes', 'builtin', 'checkbox', {
    helpText: 'Select which content types to include on this hub page.',
  });

  contentHubPage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {}
  );

  contentHubPage.changeFieldControl('hasPart', 'builtin', 'entryLinksEditor', {
    helpText:
      'Page sections will be displayed distributed between the content preview cards, on the first page only.',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });


  const browsePage = migration.editContentType('browsePage');
  browsePage.changeFieldControl(
    'identifier',
    'app',
    process.env.SLUG_VALIDATION_APP_ID,
    {
      contentTypes: 'contentHubPage,landingPage,staticPage',
      helpText: identifierFieldHelpText,
    }
  );
  browsePage.editField('name').validations(nameFieldValidations);

  const landingPage = migration.editContentType('landingPage');
  landingPage.changeFieldControl(
    'identifier',
    'app',
    process.env.SLUG_VALIDATION_APP_ID,
    {
      contentTypes: 'browsePage,contentHubPage,staticPage',
      helpText: identifierFieldHelpText,
    }
  );
  landingPage.editField('name').validations(nameFieldValidations);

  const staticPage = migration.editContentType('staticPage');
  staticPage.changeFieldControl(
    'identifier',
    'app',
    process.env.SLUG_VALIDATION_APP_ID,
    {
      contentTypes: 'browsePage,contentHubPage,landingPage',
      helpText: identifierFieldHelpText,
    }
  );
  staticPage.editField('name').validations(nameFieldValidations);
};
