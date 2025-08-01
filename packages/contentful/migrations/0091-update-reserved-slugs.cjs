module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');
  const staticPage = migration.editContentType('staticPage');

  [browsePage, staticPage].forEach(page =>
    page
      .editField('identifier')
      .validations([
        {
          unique: true
        },
        {
          prohibitRegexp: {
            pattern: '^(account$|account/|api$|api/|blog$|blog/|collections/|contentful/|debug$|debug/|exhibitions$|exhibitions/|galleries$|galleries/|iiif$|item/|media$|record/|schemas$|schemas/|search$|themes/)',
            flags: null
          },
          message: 'This URL slug is reserved.'
        }
      ])
  );
};
