module.exports = function(migration) {
  const scheduledImageSet = migration
    .createContentType('scheduledImageSet')
    .name('Scheduled Image Set')
    .description('Set of Images that can be scheduled for use on the homepage')
    .displayField('headline');

  scheduledImageSet
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(false)
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

  scheduledImageSet
    .createField('hasPart')
    .name('Images')
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
            'imageWithAttribution'
          ]
        }
      ],
      linkType: 'Entry'
    });

    scheduledImageSet
      .createField('datePublished')
      .name('Publish at')
      .type('Date')
      .localized(false)
      .required(true)
      .validations([])
      .disabled(false)
      .omitted(false);

};
