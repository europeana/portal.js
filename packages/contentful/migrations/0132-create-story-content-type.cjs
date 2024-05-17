module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }
  if (!process.env.CATEGORY_SUGGEST_APP_ID) {
    console.log('No app ID specified in CATEGORY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const story = migration
    .createContentType('story')
    .name('Story')
    .description('')
    .displayField('name');
  story
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  story
    .createField('identifier')
    .name('URL slug')
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

  story
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .disabled(false)
    .omitted(false);

  story
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

  story
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

  story
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  story
    .createField('author')
    .name('Author(s)')
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
          linkContentType: ['person']
        }
      ],
      linkType: 'Entry'
    });

  story.createField('relatedLink')
    .name('Related entities')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 5
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern: '^http://data.europeana.eu/(agent|concept|timespan|organization|place)/?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  story
    .createField('contentWarning')
    .name('Content Warning')
    .type('Link')
    .validations([
      {
        linkContentType: ['contentWarning']
      }
    ])
    .linkType('Entry');

  story
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
          linkContentType: ['category']
        }
      ],
      linkType: 'Entry'
    });

  story
    .createField('genre')
    .name('Themes')
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
          in: [
            'archaeology',
            'art',
            'fashion',
            'industrial-heritage',
            'manuscripts',
            'maps-and-geography',
            'migration',
            'music',
            'natural-history',
            'newspapers',
            'photography',
            'sport',
            'world-war-i'
          ]
        }
      ]
    });

  story.changeFieldControl('name', 'builtin', 'singleLine', {});
  story.changeFieldControl('identifier', 'builtin', 'slugEditor', {});

  story.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'For SEO, please make sure there is a short description.'
  });

  story.changeFieldControl('datePublished', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ'
  });

  story.changeFieldControl('primaryImageOfPage', 'builtin', 'entryLinkEditor', {
    helpText: 'Images wider than 2520 pixels will take the whole width of the page, others aligned with the content.'
  });

  story.changeFieldControl('hasPart', 'builtin', 'entryCardsEditor', {
    bulkEditing: false
  });

  story.changeFieldControl('author', 'builtin', 'entryLinksEditor', {
    bulkEditing: false
  });

  story.changeFieldControl('categories', 'app', process.env.CATEGORY_SUGGEST_APP_ID);
  story.changeFieldControl('genre', 'builtin', 'checkbox');

  story.changeFieldControl('relatedLink', 'app', process.env.ENTITY_SUGGEST_APP_ID);
};
