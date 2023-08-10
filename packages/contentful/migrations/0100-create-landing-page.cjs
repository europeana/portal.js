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

  // Create image card to be used by landing page
  const imageCard = migration
    .createContentType('imageCard')
    .name('Image card')
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

  // Create content group to be used by landing page
  const contentGroup = migration
    .createContentType('contentGroup')
    .name('Content group')
    .displayField('name');

  contentGroup
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

  contentGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  contentGroup.changeFieldControl('text', 'builtin', 'multipleLine', {});

  contentGroup
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 10
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['illustration', 'imageCard', 'richText']
        }
      ],

      linkType: 'Entry'
    });

  // Create landing page
  const landingPage = migration
    .createContentType('landingPage')
    .name('Landing page')
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
    .type('Symbol')
    .localized(true)
    .disabled(false)
    .omitted(false);

  landingPage.changeFieldControl('headline', 'builtin', 'singleLine', {
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
      helpText: 'Used in the hero and for link cards and social media image'
    }
  );

  landingPage
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
          linkContentType: ['contentGroup', 'richText']
        }
      ],

      linkType: 'Entry'
    });
};
