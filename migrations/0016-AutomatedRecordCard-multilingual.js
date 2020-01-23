module.exports = function(migration) {
  const automatedRecordCard = migration.editContentType('automatedRecordCard');

  automatedRecordCard
    .editField('name')
    .localized(true);

  automatedRecordCard
    .editField('creator')
    .localized(true);

  automatedRecordCard
    .editField('provider')
    .localized(true);
};
