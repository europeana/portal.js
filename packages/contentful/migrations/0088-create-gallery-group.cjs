module.exports = function(migration) {
  const galleryGroup = migration
    .createContentType('galleryGroup')
    .name('Gallery group')
    .description('List of gallery set id\'s')
    .displayField('title');

  galleryGroup
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  galleryGroup.changeFieldControl('title', 'builtin', 'singleLine', {});

  galleryGroup.createField('galleries')
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

  // TODO: Use set suggest app when available
  // galleryGroup.changeFieldControl('gallerys', 'app', process.env.SET_SUGGEST_APP_ID);
};
