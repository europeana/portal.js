module.exports = function(migration) {
  const illustration = migration.editContentType('illustration');

  illustration
    .createField('quality')
    .name('Quality')
    .type('Integer')
    .localized(false)
    .required(false)
    .validations([
      {
        range: {
          min: 40,
          max: 100,
        },
      },
    ])
    .defaultValue({
      'en-GB': 40,
    })
    .disabled(false)
    .omitted(false);

  illustration.changeFieldControl('quality', 'builtin', 'numberEditor', {
    helpText: 'Quality at which to render the illustration image.',
  });
};
