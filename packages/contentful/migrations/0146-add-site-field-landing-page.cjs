module.exports = function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .createField('site')
    .name('Site')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'www.europeana.eu',
          'dataspace-culturalheritage.eu'
        ]
      }
    ])
    .defaultValue({
      'en-GB': 'www.europeana.eu'
    })
    .disabled(false)
    .omitted(false);

  landingPage.changeFieldControl('site', 'builtin', 'dropdown');

  landingPage
    .moveField('site')
    .afterField('name');
};
