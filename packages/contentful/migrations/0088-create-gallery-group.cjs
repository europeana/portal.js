module.exports = function(migration) {
  if (!process.env.SET_SUGGEST_APP_ID) {
    console.log('No app ID specified in SET_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const galleryGroup = migration
    .createContentType('galleryGroup')
    .name('Gallery group')
    .description('List of gallery set id\'s')
    .displayField('headline');

  galleryGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  galleryGroup.changeFieldControl('headline', 'builtin', 'singleLine', {});

  galleryGroup.createField('hasPart')
    .name('Galleries')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 4
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
            pattern: '^http://data.europeana.eu/set/?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  galleryGroup.changeFieldControl('hasPart', 'app', process.env.SET_SUGGEST_APP_ID);
};
