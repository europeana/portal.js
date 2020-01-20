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
};
