module.exports = async function (migration, context) {
  migration.deleteContentType('latestCardGroup');
};
