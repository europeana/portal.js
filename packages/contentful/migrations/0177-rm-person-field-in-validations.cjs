const FIELDS = [
  'communities',
  'participation',
  'roleChair',
  'roleViceChair',
  'roleTreasurer',
  'roleMember'
];

module.exports = function(migration) {
  const person = migration.editContentType('person');

  for (const field of FIELDS) {
    person
      .editField(field)
      .items({
        type: 'Symbol',
        validations: []
      });
  }
};
