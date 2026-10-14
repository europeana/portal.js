module.exports = function(migration) {
  const entityGroup = migration
    .createContentType('entityGroup')
    .name('Entity group')
    .description('Group of Europeana entity IDs')
    .displayField('headline');

  entityGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  entityGroup
    .createField('hasPart')
    .name('Entities')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 8
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
            pattern: '^http://data.europeana.eu/(agent|concept|timespan|organization)/[0-9]+$',
            flags: null
          }
        }
      ]
    });

  entityGroup.changeFieldControl('headline', 'builtin', 'singleLine', {});
  entityGroup.changeFieldControl(
    'hasPart',
    'app',
    '3zmNQ2ULcZwTOXL7B9nDRr',
    {}
  );

  const themePage = migration.editContentType('themePage');
  themePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: [
            'topicGroup',
            'personGroup',
            'galleryGroup',
            'primaryCallToAction',
            'cardGroup',
            'entityGroup'
          ]
        }
      ],
      linkType: 'Entry'
    });
};
