module.exports = function(migration) {
  if (!process.env.RECORD_HARVESTER_APP_ID) {
    console.log('No app ID specified in RECORD_HARVESTER_APP_ID; aborting.');
    process.exit(1);
  }

  const automatedRecordCard = migration.editContentType('automatedRecordCard');
  automatedRecordCard.changeFieldControl('identifier', 'app', process.env.RECORD_HARVESTER_APP_ID);
};
