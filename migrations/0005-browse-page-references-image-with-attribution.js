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
    .displayField('name');
  browsePage
    .moveField('name')
    .toTheTop();

  browsePage
    .changeFieldId('text', 'description');
  browsePage
    .editField('description')
    .disabled(false);
  browsePage
    .moveField('description')
    .afterField('identifier');

  browsePage
    .createField('headline')
    .name('Headline')
    .type('Symbol')
    .localized(true)
    .disabled(false)
    .omitted(false);
  browsePage
    .moveField('headline')
    .afterField('description');
  browsePage.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'Headline to use on the hero banner.'
  });
};
