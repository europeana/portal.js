const deleteContentEntries = require('../src/utils/deleteContentEntries.cjs');

module.exports = async function (migration, context) {
  await deleteContentEntries('latestCardGroup', migration, context);

  migration.deleteContentType('latestCardGroup');
};
