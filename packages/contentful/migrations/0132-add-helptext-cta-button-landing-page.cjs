module.exports = function(migration) {
  const landingPage = migration
    .editContentType('landingPage');

  landingPage
    .createField('relatedLinkDescription')
    .name('CTA Help text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  landingPage.changeFieldControl('relatedLinkDescription', 'builtin', 'markdown', {
    helpText: 'Text to accompany the CTA button.'
  });

  landingPage
    .moveField('relatedLinkDescription')
    .afterField('relatedLink');
};
