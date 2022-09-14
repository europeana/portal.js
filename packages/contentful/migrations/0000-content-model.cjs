module.exports = function(migration) {
  const automatedEntityCard = migration
    .createContentType('automatedEntityCard')
    .name('Automated Entity Card')
    .description('')
    .displayField('name');
  automatedEntityCard
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  automatedEntityCard
    .createField('identifier')
    .name('Entity ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern:
            '^http://data\\.europeana\\.eu/(agent|concept|organization|place)(/base)?/[0-9]+$',
          flags: null
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  automatedEntityCard
    .createField('slug')
    .name('Entity slug')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  automatedEntityCard
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          min: 0,
          max: 140
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  automatedEntityCard
    .createField('image')
    .name('Image')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);
  automatedEntityCard.changeFieldControl('name', 'builtin', 'singleLine', {});

  automatedEntityCard.changeFieldControl(
    'identifier',
    'extension',
    'disabledSingleLineText',
    {
      helpText:
        'This ID will be automatically set when an entity has been harvested.'
    }
  );

  automatedEntityCard.changeFieldControl(
    'slug',
    'extension',
    'disabledSingleLineText',
    {
      helpText:
        'This slug will be automatically set when an entity has been harvested.'
    }
  );

  automatedEntityCard.changeFieldControl(
    'description',
    'builtin',
    'multipleLine',
    {}
  );
  automatedEntityCard.changeFieldControl('image', 'builtin', 'urlEditor', {});
  const heroBanner = migration
    .createContentType('heroBanner')
    .name('Hero banner')
    .description('')
    .displayField('headline');

  heroBanner
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          max: 50
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  heroBanner
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 175
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  heroBanner
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['image']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  heroBanner
    .createField('citation')
    .name('Attribution')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  heroBanner
    .createField('license')
    .name('Rights Statement')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  heroBanner
    .createField('identifier')
    .name('Record ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '\\/[0-9]+\\/[a-zA-Z0-9_]+$',
          flags: null
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  heroBanner.changeFieldControl('headline', 'builtin', 'singleLine', {});
  heroBanner.changeFieldControl('description', 'builtin', 'markdown', {});
  heroBanner.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  heroBanner.changeFieldControl('citation', 'builtin', 'singleLine', {});
  heroBanner.changeFieldControl('license', 'builtin', 'singleLine', {});
  heroBanner.changeFieldControl(
    'identifier',
    'extension',
    'disabledSingleLineText',
    {}
  );
  const linkGroup = migration
    .createContentType('linkGroup')
    .name('Link Group')
    .description('A grouping of link objects.')
    .displayField('identifier');

  linkGroup
    .createField('identifier')
    .name('Identifier')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  linkGroup
    .createField('links')
    .name('Links')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['link']
        }
      ],

      linkType: 'Entry'
    });

  linkGroup.changeFieldControl('identifier', 'builtin', 'singleLine', {});

  linkGroup.changeFieldControl('links', 'builtin', 'entryLinksEditor', {
    bulkEditing: false
  });

  const richText = migration
    .createContentType('richText')
    .name('Rich text')
    .description('A section of rich text for use on a page.')
    .displayField('headline');

  richText
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 150
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  richText
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  richText.changeFieldControl('headline', 'builtin', 'singleLine', {});
  richText.changeFieldControl('text', 'builtin', 'markdown', {});
  const automatedRecordCard = migration
    .createContentType('automatedRecordCard')
    .name('Automated Record Card')
    .description('')
    .displayField('name');

  automatedRecordCard
    .createField('identifier')
    .name('Record ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '\\/[0-9]+\\/[a-zA-Z0-9_]+$'
        },

        message: 'Invalid Record ID format, e.g. /2021609/objecten_90450_21'
      }
    ])
    .disabled(false)
    .omitted(false);

  automatedRecordCard
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  automatedRecordCard
    .createField('creator')
    .name('Creator')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  automatedRecordCard
    .createField('provider')
    .name('Institution')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  automatedRecordCard
    .createField('thumbnailUrl')
    .name('Thumbnail URL')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(true)
    .omitted(false);
  automatedRecordCard.changeFieldControl(
    'identifier',
    'extension',
    'europeanaRecordID',
    {}
  );
  automatedRecordCard.changeFieldControl('name', 'builtin', 'singleLine', {});
  automatedRecordCard.changeFieldControl(
    'creator',
    'builtin',
    'singleLine',
    {}
  );
  automatedRecordCard.changeFieldControl(
    'provider',
    'builtin',
    'singleLine',
    {}
  );
  automatedRecordCard.changeFieldControl(
    'thumbnailUrl',
    'builtin',
    'singleLine',
    {}
  );

  const browsePage = migration
    .createContentType('browsePage')
    .name('Browse Page')
    .description(
      'A high-level page geared towards browsing a selection of content, mixing editorially curated and automatically curated works.'
    )
    .displayField('headline');

  browsePage
    .createField('headline')
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

  browsePage
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

  browsePage
    .createField('text')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          min: 60,
          max: 2000
        },

        message:
          'For SEO, please make sure there is a description between 60 and 2000 characters.'
      }
    ])
    .disabled(true)
    .omitted(false);

  browsePage
    .createField('primaryImageOfPage')
    .name('Hero Banner')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['heroBanner']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  browsePage
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

  browsePage
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
          linkContentType: ['cardGroup', 'richText'],
          message: 'You can only add card groups and rich text here (for now).'
        }
      ],

      linkType: 'Entry'
    });

  browsePage.changeFieldControl('headline', 'builtin', 'singleLine', {});

  browsePage.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Do not include a leading slash. The homepage has slug "home".'
  });

  browsePage.changeFieldControl('text', 'builtin', 'markdown', {});
  browsePage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {}
  );
  browsePage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});

  browsePage.changeFieldControl('hasPart', 'builtin', 'entryLinksEditor', {
    bulkEditing: false
  });

  const curatedCard = migration
    .createContentType('curatedCard')
    .name('Curated Card')
    .description(
      'A curated piece of content, which can link to whatever you want it to.'
    )
    .displayField('name');
  curatedCard
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  curatedCard
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  curatedCard
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['image']
      },
      {
        assetImageDimensions: {
          width: {
            min: 200,
            max: null
          },

          height: {
            min: 250,
            max: null
          }
        },

        message: '200x250px minimum'
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  curatedCard
    .createField('url')
    .name('URL')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  curatedCard
    .createField('contentSource')
    .name('Content Source')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Blog', 'Exhibition', 'Record', 'External Link', 'Gallery']
      }
    ])
    .disabled(true)
    .omitted(true);

  curatedCard.changeFieldControl('name', 'builtin', 'singleLine', {});
  curatedCard.changeFieldControl('description', 'builtin', 'markdown', {});
  curatedCard.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  curatedCard.changeFieldControl('url', 'builtin', 'singleLine', {});
  curatedCard.changeFieldControl('contentSource', 'builtin', 'dropdown', {});
  const entityPage = migration
    .createContentType('entityPage')
    .name('Entity Page')
    .description('')
    .displayField('name');
  entityPage
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  entityPage
    .createField('identifier')
    .name('Entity ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  entityPage
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
          linkContentType: ['cardGroup', 'richText']
        }
      ],

      linkType: 'Entry'
    });

  entityPage
    .createField('genre')
    .name('Theme')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: [
          'archaeology',
          'art',
          'fashion',
          'industrial',
          'manuscript',
          'map',
          'migration',
          'music',
          'nature',
          'newspaper',
          'photography',
          'sport',
          'ww1'
        ]
      }
    ])
    .disabled(false)
    .omitted(false);

  entityPage
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);
  entityPage
    .createField('type')
    .name('Entity type')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);

  entityPage.changeFieldControl('name', 'extension', 'disabledSingleLineText', {
    helpText: 'For editorial context only, the title will be read from the API'
  });

  entityPage.changeFieldControl(
    'identifier',
    'extension',
    'disabledSingleLineText',
    {
      helpText:
        'The entity to add content to, use the Harvest button on the right to select one'
    }
  );

  entityPage.changeFieldControl('hasPart', 'builtin', 'entryLinksEditor', {
    bulkEditing: false
  });

  entityPage.changeFieldControl('genre', 'builtin', 'dropdown', {
    helpText:
      'Select one of the curated Europeana themes to use as the search for this entity instead of its ID.'
  });

  entityPage.changeFieldControl('slug', 'builtin', 'singleLine', {});
  entityPage.changeFieldControl('type', 'builtin', 'singleLine', {});
  const link = migration
    .createContentType('link')
    .name('Link')
    .description('A link to another page.')
    .displayField('text');

  link
    .createField('url')
    .name('URL')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        regexp: {
          pattern:
            '^(((ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?)|(\\/|\\/([\\w#!:.?+=&%@!\\-\\/])*))$'
        },

        message: 'Muts be a URL or a URL path starting with "/"'
      }
    ])
    .disabled(false)
    .omitted(false);

  link
    .createField('text')
    .name('Text')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  link.changeFieldControl('url', 'builtin', 'singleLine', {});
  link.changeFieldControl('text', 'builtin', 'singleLine', {});
  const cardGroup = migration
    .createContentType('cardGroup')
    .name('Card Group')
    .description('A group of 4-8 content cards.')
    .displayField('headline');

  cardGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 60
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  cardGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 600
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  cardGroup
    .createField('hasPart')
    .name('Cards')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 8
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: [
            'automatedEntityCard',
            'automatedRecordCard',
            'curatedCard'
          ]
        }
      ],

      linkType: 'Entry'
    });

  cardGroup.changeFieldControl('headline', 'builtin', 'singleLine', {});
  cardGroup.changeFieldControl('text', 'builtin', 'markdown', {});

  cardGroup.changeFieldControl('hasPart', 'builtin', 'entryCardsEditor', {
    bulkEditing: false
  });
};
