module.exports = function(migration) {
  const embed = migration
    .createContentType('embed')
    .name('Embed')
    .description(
      'Embed code into a page to show interactive content.'
    )
    .displayField('name');
  embed
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  embed
    .createField('embed')
    .name('Embed')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  embed.changeFieldControl('name', 'builtin', 'singleLine', {});
  embed.changeFieldControl('embed', 'builtin', 'multipleLine', {});
};
