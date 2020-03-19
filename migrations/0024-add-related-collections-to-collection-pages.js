module.exports = function(migration) {
  const cardGroup = migration.editContentType('entityPage');
  cardGroup.createField('relatedLinks')
    .name('Related collections')
    .type('Array')
    .localized(false)
    .validations([ {
      size: {
        max: 4
      }
    }])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern:
              '^http://data\\.europeana\\.eu/(agent|concept|organization|place)(/base)?/[0-9]+$',
            flags: null
          }
        }
      ]
    });
};
