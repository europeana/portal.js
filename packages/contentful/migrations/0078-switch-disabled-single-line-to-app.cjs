module.exports = function(migration) {
  if (!process.env.DISABLED_SINGLE_LINE_APP_ID) {
    console.log('No app ID specified in DISABLED_SINGLE_LINE_APP_ID; aborting.');
    process.exit(1);
  }

  const entityPage = migration.editContentType('entityPage');
  entityPage.changeFieldControl('identifier', 'app', process.env.DISABLED_SINGLE_LINE_APP_ID, {
    helpText: 'The entity to add content to, use the Harvest button on the right to select one'
  });
  entityPage.changeFieldControl('name', 'app', process.env.DISABLED_SINGLE_LINE_APP_ID, {
    helpText: 'For editorial context only, the title will be read from the API'
  });

  const automatedEntityCard = migration.editContentType('automatedEntityCard');
  automatedEntityCard.changeFieldControl('identifier', 'app', process.env.DISABLED_SINGLE_LINE_APP_ID, {
    helpText: 'This ID will be automatically set when an entity has been harvested.'
  });
  automatedEntityCard.changeFieldControl('slug', 'app', process.env.DISABLED_SINGLE_LINE_APP_ID, {
      helpText: 'This slug will be automatically set when an entity has been harvested.'
  });

  const automatedRecordCard = migration.editContentType('automatedRecordCard');
  automatedRecordCard.changeFieldControl('name', 'app', process.env.DISABLED_SINGLE_LINE_APP_ID, {
    helpText: 'This field will be automatically set when an item has been harvested.'
  });
};
