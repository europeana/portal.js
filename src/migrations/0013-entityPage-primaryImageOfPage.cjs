module.exports = function(migration) {
  const entityPage = migration.editContentType('entityPage');

  entityPage
    .createField('primaryImageOfPage')
    .name('Featured image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  entityPage
    .moveField('primaryImageOfPage')
    .afterField('description');

  entityPage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {
      helpText: 'If empty, the depiction from the Entity Collection will be displayed instead.'
    }
  );
};
