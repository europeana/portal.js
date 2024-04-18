module.exports = function(migration) {
  const staticPage = migration.editContentType('staticPage');

  staticPage
    .createField('automatedTranslation')
    .name('Automated translation')
    .type('Boolean')
    .localized(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  staticPage.changeFieldControl('automatedTranslation', 'builtin', 'boolean', {
    helpText: 'Select per locale when page content consist of auto-generated translations. When selected, it displays a label on the page.'
  });
};
