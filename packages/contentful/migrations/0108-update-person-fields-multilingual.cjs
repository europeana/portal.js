module.exports = function(migration) {
  const person = migration
    .editContentType('person');

  person
    .editField('name')
    .localized(true);
  person
    .editField('affiliation')
    .localized(true);
  person.changeFieldControl(
    'affiliation',
    'builtin',
    'singleLine',
    {
      helpText:
        'The English value is the default value for all other locales. An English label must be provided as a fallback, otherwise the organisation will only show when using the language(s) where it is specified.'
    }
  );
};
