module.exports = function(migration) {
  const embed = migration.editContentType('embed');

  embed.editField('embed')
    .localized(true);
};
