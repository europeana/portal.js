module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('primaryImageOfPage')
    .validations([
      {
        linkContentType: ['heroBanner', 'imageWithAttribution']
      }
    ]);

  browsePage
    .changeFieldId('headline', 'name');

  browsePage
    .createField('headline')
    .name('Headline')
    .type('Symbol')
    .localized(true)
    .disabled(false)
    .omitted(false);

  browsePage.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'Headline to use on the hero banner.'
  });

  browsePage
    .changeFieldId('text', 'description');

  browsePage
    .editField('description')
    .disabled(false);
};
