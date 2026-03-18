module.exports = function (migration) {
  if (!process.env.CATEGORY_SUGGEST_APP_ID) {
    console.log('No app ID specified in CATEGORY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const event = migration
    .createContentType('event')
    .name('Event')
    .description(
      'Represents an event with optional start and end date, and external link URL. Includes more specific types of event such as training courses.'
    )
    .displayField('name');

  event
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  event
    .createField('startDate')
    .name('Start date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  event
    .createField('endDate')
    .name('End date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  event
    .createField('url')
    .name('URL')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  event
    .createField('image')
    .name('Teaser image')
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

  event
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  event
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
          linkContentType: ['category'],
        },
      ],

      linkType: 'Entry',
    });

  event.changeFieldControl('name', 'builtin', 'singleLine', {});

  event.changeFieldControl('startDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
  });

  event.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
    helpText: 'Leave blank for one day events.',
  });

  event.changeFieldControl('url', 'builtin', 'singleLine', {});
  event.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});

  event.changeFieldControl('datePublished', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ',
  });

  event.changeFieldControl('categories', 'app', process.env.CATEGORY_SUGGEST_APP_ID, {});

  event.addTaxonomyValidation('eventType', 'TaxonomyConceptScheme', { required: true });
};
