module.exports = function(migration) {
  const person = migration.editContentType('person');

  person
    .createField('zohoContact')
    .name('Zoho contact')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['zohoContact'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  person.changeFieldControl('zohoContact', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false
  });
};
