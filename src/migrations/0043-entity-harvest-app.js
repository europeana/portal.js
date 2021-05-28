module.exports = function(migration) {
  return 'WIP, this migration is not ready.';
  if (!process.env.ENTITY_HARVEST_APP_ID) {
    console.log('No app ID specified in ENTITY_HARVEST_APP_ID; aborting.');
    process.exit(1);
  }

  const automatedEntityCard = migration.editContentType('automatedEntityCard');

  // "Entity harvester - Europeana" app (pre-installed in space & env)
  automatedEntityCard.removeSidebarWidget('extension', 'europeanaImageHarvester');
  automatedEntityCard.addSidebarWidget('app',  process.env.ENTITY_SUGGEST_APP_ID, {}, 'content-preview-widget');
  automatedEntityCard
    .changeFieldControl('identifier')
    .validations([
      {
        regexp: {
          pattern:
            '^http://data\\.europeana\\.eu/(agent|concept|organization|place|timespan)(/base)?/[0-9]+$',
          flags: null
        }
      }
    ]);
  const collectionPage = migration.editContentType('collectionPage');

  // "Entity harvester - Europeana" app (pre-installed in space & env)
  collectionPage.removeSidebarWidget('extension', 'europeanaImageHarvester');
  collectionPage.addSidebarWidget('app',  process.env.ENTITY_SUGGEST_APP_ID, {}, 'content-preview-widget');
};
