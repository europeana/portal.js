module.exports = function(migration) {
  const person = migration
    .editContentType('person');

  person
    .editField('name')
    .localized(true);
  person
    .editField('affiliation')
    .localized(true);

};
