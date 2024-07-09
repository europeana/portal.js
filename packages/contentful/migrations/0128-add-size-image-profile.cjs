module.exports = function(migration) {
  const imageDisplayProfile = migration.editContentType('imageDisplayProfile');

  imageDisplayProfile
    .editField('sizes')
    .name('Sizes')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-GB': ['small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'wqhd', '4k', '4k+']
    })
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: ['small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'wqhd', '4k', '4k+']
        }
      ]
    });
};
