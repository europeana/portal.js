module.exports = function(migration) {
  const link = migration
    .editContentType('link');

  link
    .createField('description')
    .name('Help text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  link.changeFieldControl('description', 'builtin', 'markdown', {
    helpText: 'Text to accompany the link. At the moment only used on Landing pages for the top section CTA button.'
  });
};
