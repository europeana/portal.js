module.exports = function(migration) {
  const illustration = migration.editContentType('illustration');

  illustration
    .createField('focus')
    .name('Focus')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: [
          'center',
          'top',
          'right',
          'left',
          'bottom',
          'top_right',
          'top_left',
          'bottom_right',
          'bottom_left'
        ],
      },
    ])
    .defaultValue({
      'en-GB': 'center',
    })
    .disabled(false)
    .omitted(false);

  illustration.changeFieldControl('focus', 'builtin', 'dropdown', {
    helpText: 'When the illustration image is cropped, where to set the focus.',
  });
};
