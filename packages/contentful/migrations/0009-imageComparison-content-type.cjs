module.exports = function(migration) {
  const imageComparison = migration
    .createContentType('imageComparison')
    .name('Image comparison')
    .description('Two images presented for comparison.')
    .displayField('name');
  imageComparison
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  imageComparison
    .createField('hasPart')
    .name('Images')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          min: 2,
          max: 2
        },

        message: 'Image comparisons require exactly 2 images.'
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['imageWithAttribution']
        }
      ],

      linkType: 'Entry'
    });

  imageComparison.changeFieldControl('name', 'builtin', 'singleLine', {});

  imageComparison.changeFieldControl('hasPart', 'builtin', 'entryCardsEditor', {
    bulkEditing: false
  });
};
