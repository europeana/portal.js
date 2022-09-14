module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('identifier')
    .validations([
      {
        unique: true
      },
      {
        prohibitRegexp: {
          pattern: '^(api$|api/|blog$|blog/|entity/|exhibitions?$|exhibition/|gallery$|gallery/|record/|schemas$|schemas/|search$)',
          flags: null
        },
        message: 'This URL slug is reserved.'
      }
    ]);
};
