module.exports = function(migration) {
  const link = migration.editContentType('link');
  link
    .editField('url')
    .validations([
      {
        regexp: {
          pattern:
            '^(((ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?)|(\\/|\\/([\\w#!:.?+=&%@!\\-\\/])*))|(#[\\w!:.?+=&%@!\\-\\/]+)|mailto:.+@.+$'
        },
        message: 'Must be a URL, a URL path starting with "/", an inline anchor starting with "#", or a mailto: address'
      }
    ]);
};
