module.exports = function(migration) {
  if (!process.env.ENTITY_HARVEST_APP_ID) {
    console.log('No app ID specified in ENTITY_HARVEST_APP_ID; aborting.');
    process.exit(1);
  }

  const automatedEntityCard = migration.editContentType('automatedEntityCard');

  // "Entity harvester - Europeana" app (pre-installed in space & env)
  automatedEntityCard.removeSidebarWidget('extension', 'europeanaEntityHarvester');
  automatedEntityCard.addSidebarWidget('app',  process.env.ENTITY_HARVEST_APP_ID, {}, 'content-preview-widget');
  automatedEntityCard
    .editField('identifier')
    .validations([
      {
        regexp: {
          pattern:
            '^http://data\\.europeana\\.eu/(agent|concept|organization|place|timespan)(/base)?/[0-9]+$',
          flags: null
        }
      }
    ]);
  const entityPage = migration.editContentType('entityPage');

  // "Entity harvester - Europeana" app (pre-installed in space & env)
  entityPage.removeSidebarWidget('extension', 'europeanaEntityHarvester');
  entityPage.addSidebarWidget('app',  process.env.ENTITY_HARVEST_APP_ID, {}, 'content-preview-widget');
};
