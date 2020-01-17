module.exports = function(migration) {
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
