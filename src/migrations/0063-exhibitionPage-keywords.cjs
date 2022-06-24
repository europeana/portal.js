module.exports = function(migration) {
  const exhibitionPage = migration
    .editContentType('exhibitionPage');

  exhibitionPage
    .createField('keywords')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: []
    });

  exhibitionPage.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
};
