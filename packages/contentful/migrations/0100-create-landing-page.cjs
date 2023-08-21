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

  illustration.changeFieldControl('text', 'builtin', 'markdown', {
    helpText: 'Text to accompany illustration. Currently only used in the Illustration group on Landing pages.'
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

  // Create sub section to be used by landing page
  const landingSubSection = migration
    .createContentType('landingSubSection')
    .name('Landing sub section')
    .description('Section with text and sections')
    .displayField('name');

  landingSubSection
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

  landingSubSection
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  landingSubSection
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
          linkContentType: ['automatedCardGroup', 'illustrationGroup']
        }
      ],

      linkType: 'Entry'
    });

  // Create landing page
  const landingPage = migration
    .createContentType('landingPage')
    .name('Landing page')
    .description('Page with a CTA header and additional info sections')
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

  landingPage.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'This field may include markdown. Use underscores to highlight part of the title. For example "This page is _awesome_"'
  });

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

  landingPage.changeFieldControl('headline', 'builtin', 'markdown', {
    helpText: 'Headline to use in the top section.'
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
      helpText: 'Used in the top section'
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
      helpText: 'Used in the top section'
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
          linkContentType: ['illustrationGroup', 'imageCardGroup', 'landingSubSection', 'embed']
        }
      ],

      linkType: 'Entry'
    });
};
