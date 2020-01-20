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

  exhibitionPage.moveField('datePublished').afterField('primaryImageOfPage');

  const imageWithAttribution = migration.editContentType('imageWithAttribution');

  imageWithAttribution
    .editField('url')
    .validations([
      {
        regexp: {
          pattern:
            '^(?![\\s\\S])|^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$'
        }
      }
    ]);
};
