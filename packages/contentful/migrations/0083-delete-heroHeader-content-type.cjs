const deleteContentEntries = require('../src/utils/deleteContentEntries.cjs');

module.exports = async function (migration, context) {
  await deleteContentEntries('heroHeader', migration, context);

  migration.deleteContentType('heroHeader');
};
