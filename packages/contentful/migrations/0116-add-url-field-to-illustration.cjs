module.exports = function(migration) {
  const contentType = migration.editContentType('illustration');

  contentType.createField('url')
    .name('URL')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([{ regexp: { pattern: '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$' } }])
    .disabled(false)
    .omitted(false);
  contentType.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: 'If a URL is supplied, the illustration will link to it.'
  });
};
