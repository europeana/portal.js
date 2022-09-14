module.exports = function(migration) {
  const person = migration
    .createContentType('person')
    .name('Person')
    .description('')
    .displayField('name');
  person
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  person
    .createField('affiliation')
    .name('Organisation')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  person
    .createField('url')
    .name('URL')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  person.changeFieldControl('name', 'builtin', 'singleLine', {});
  person.changeFieldControl('affiliation', 'builtin', 'singleLine', {});
  person.changeFieldControl('url', 'builtin', 'urlEditor', {});
};
