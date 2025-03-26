module.exports = function(migration) {
  const link = migration.editContentType('link');
  link
    .editField('url')
    .validations([
      {
        regexp: {
          pattern:
            '^(((ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?)|(\\/|\\/([\\w#!:.?+=&%@!\\-\\/])*))|(#[\\w!:.?+=&%@!\\-\\/]+)$'
        },
        message: 'Must be a URL, a URL path starting with "/", or an inline anchor starting with "#"'
      }
    ]);
};
