module.exports = function(migration) {
  const exhibitionPage = migration.editContentType('exhibitionPage');

  exhibitionPage
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  const imageWithAttribution = migration.editContentType('imageWithAttribution');

  imageWithAttribution
    .editField('url')
    .name('URL')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(?![\\s\\S])|^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$'
        }
      }
    ])
    .disabled(false)
    .omitted(false);
};
