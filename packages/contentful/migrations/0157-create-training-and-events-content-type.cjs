module.exports = function(migration) {
  if (!process.env.CATEGORY_SUGGEST_APP_ID) {
    console.log('No app ID specified in CATEGORY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const eventPage = migration
    .createContentType('eventPage')
    .name('Event Page')
    .description(
      'Event page, links to external events and contains info for the event listing card.'
    )
    .displayField('name');

  eventPage
    .createField('name')
    .name('Title')
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

  eventPage
    .createField('identifier')
    .name('URL')
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

  eventPage
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  eventPage
    .createField('image')
    .name('Teaser image')
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

  eventPage
    .createField('startDate')
    .name('Start Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  eventPage
    .createField('endDate')
    .name('End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  eventPage
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

  eventPage.changeFieldControl('name', 'builtin', 'singleLine', {});
  eventPage.changeFieldControl('identifier', 'builtin', 'urlEditor', {
    helpText: 'Full URL of the event page.'
  });
  eventPage.changeFieldControl('datePublished', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ'
  });

  eventPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  eventPage.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
    helpText: 'Leave blank for one day events.'
  });

  eventPage.changeFieldControl('categories', 'app', process.env.CATEGORY_SUGGEST_APP_ID);

  const trainingPage = migration
    .createContentType('trainingPage')
    .name('Training Page')
    .description(
      'Training page, links to externa trainining/courses and contains info for the training listing card.'
    )
    .displayField('name');

  trainingPage
    .createField('name')
    .name('Title')
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

  trainingPage
    .createField('identifier')
    .name('URL')
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

  trainingPage
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  trainingPage
    .createField('image')
    .name('Teaser image')
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

  trainingPage
    .createField('startDate')
    .name('Start Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  trainingPage
    .createField('endDate')
    .name('End Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  trainingPage
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

  trainingPage.changeFieldControl('name', 'builtin', 'singleLine', {});
  trainingPage.changeFieldControl('identifier', 'builtin', 'urlEditor', {
    helpText: 'Full URL of the training page.'
  });
  trainingPage.changeFieldControl('datePublished', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ'
  });

  trainingPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  trainingPage.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
    helpText: 'Leave blank for ongoing courses.'
  });

  trainingPage.changeFieldControl('categories', 'app', process.env.CATEGORY_SUGGEST_APP_ID);

  const contentHubPage = migration.editContentType('contentHubPage');
  contentHubPage
    .editField('contentTypes')
    .items({
      type: 'Symbol',

      validations: [
        {
          in: ['blog post', 'exhibition', 'project', 'story', 'training', 'event']
        }
      ]
    });

  contentHubPage
    .editField('featuredContent')
    .validations([
      {
        // TODO: add training and event when available
        linkContentType: ['blogPosting', 'eventPage', 'exhibitionPage', 'project', 'trainingPage', 'story']
      }
    ]);
};
