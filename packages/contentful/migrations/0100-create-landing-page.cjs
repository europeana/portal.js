require('dotenv').config();

if (!process.env.SLUG_VALIDATION_APP_ID) {
  console.log('No app ID specified in SLUG_VALIDATION_APP_ID; aborting.');
  process.exit(1);
}

module.exports = async function(migration) {
  // Update illustration to also allow text to be used by landing page
  const illustration = migration.editContentType('illustration');

  illustration
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  illustration.changeFieldControl('text', 'builtin', 'multipleLine', {
    helpText: 'Only for when illustrations are accompanied by text. Currently only Welcome pack (Share your data)'
  });

  illustration
    .description('Illustration with optional text field.');

  // Create image card to be used by landing page
  const imageCard = migration
    .createContentType('imageCard')
    .name('Image card')
    .description('Card With attributed image. Without link.')
    .displayField('name');

  imageCard
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  imageCard
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageCard.changeFieldControl('text', 'builtin', 'multipleLine', {});

  imageCard
    .createField('image')
    .name('Image')
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

  // Create illustration group to be used by landing page
  const illustrationGroup = migration
    .createContentType('illustrationGroup')
    .name('Illustration group')
    .description('Section with text and grouped illustrations')
    .displayField('name');

  illustrationGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  illustrationGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  illustrationGroup.changeFieldControl('text', 'builtin', 'multipleLine', {});

  illustrationGroup
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 6
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['illustration']
        }
      ],

      linkType: 'Entry'
    });

  // Create image card group to be used by landing page
  const imageCardGroup = migration
    .createContentType('imageCardGroup')
    .name('Image card group')
    .description('Section with text and grouped image cards')
    .displayField('name');

  imageCardGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  imageCardGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageCardGroup.changeFieldControl('text', 'builtin', 'multipleLine', {});

  imageCardGroup
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 6
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['imageCard']
        }
      ],

      linkType: 'Entry'
    });

  // Create landing page
  const landingPage = migration
    .createContentType('landingPage')
    .name('Landing page')
    .description('Page with a hero and several content sections')
    .displayField('name');

  landingPage
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

  landingPage.changeFieldControl('name', 'builtin', 'singleLine', {});

  landingPage
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
  landingPage.changeFieldControl('identifier', 'app', process.env.SLUG_VALIDATION_APP_ID, {
    helpText: 'Do not include a leading slash. Should be unique for browse, static and landing pages',
    contentTypes: 'browsePage,staticPage'
  });

  landingPage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .disabled(false)
    .omitted(false);

  landingPage
    .changeFieldControl('description', 'builtin', 'singleLine', {
      helpText: 'For SEO, please make sure there is a short description.'
    });

  landingPage
    .createField('headline')
    .name('Headline')
    .type('Text')
    .localized(true)
    .disabled(false)
    .omitted(false);

  landingPage.changeFieldControl('headline', 'builtin', 'multipleLine', {
    helpText: 'Headline to use in the hero.'
  });

  landingPage
    .createField('relatedLink')
    .name('CTA Button')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['link']
      }
    ])
    .disabled(false)
    .omitted(false);

  landingPage.changeFieldControl(
    'relatedLink',
    'builtin',
    'entryLinkEditor',
    {
      helpText: 'Used in the hero'
    }
  );

  landingPage
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

  landingPage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {
      helpText: 'Used in the hero'
    }
  );

  landingPage
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

  landingPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});

  landingPage
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 20
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['automatedCardGroup', 'illustrationGroup', 'imageCardGroup', 'richText']
        }
      ],

      linkType: 'Entry'
    });
};
