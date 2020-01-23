module.exports = function(migration) {
  const imageGallery = migration
    .createContentType('imageGallery')
    .description('')
    .name('Gallery')
    .displayField('headline');

  imageGallery
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
          max: 60
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  imageGallery
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

  imageGallery
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 280
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  imageGallery
    .createField('genre')
    .name('Categories')
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
            'Archaeology',
            'Architecture',
            'Art',
            'Food and Drink',
            'Fashion',
            'Industrial Heritage',
            'Literature',
            'Maps and Geography',
            'Migration',
            'Music',
            'Natural History',
            'Manuscripts',
            'Newspapers',
            'Performing Arts',
            'Photography',
            'Sport',
            'Travel',
            'World War I'
          ]
        }
      ]
    });

  imageGallery
    .createField('hasPart')
    .name('Images')
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
          linkContentType: ['automatedRecordCard']
        }
      ],
      linkType: 'Entry'
    });

  imageGallery
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageGallery.changeFieldControl('headline', 'builtin', 'singleLine', {});

  imageGallery.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Do not include a leading slash.'
  });

  imageGallery.changeFieldControl('description', 'builtin', 'markdown', {});

  imageGallery.changeFieldControl('genre', 'builtin', 'checkbox', {});

  imageGallery.changeFieldControl('hasPart', 'builtin', 'entryCardsEditor', {
    bulkEditing: false
  });

  imageGallery.changeFieldControl('datePublished', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ'
  });
};
