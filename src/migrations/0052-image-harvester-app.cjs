module.exports = function(migration) {
  if (!process.env.IMAGE_HARVESTER_APP_ID) {
    console.log('No app ID specified in IMAGE_HARVESTER_APP_ID; aborting.');
    process.exit(1);
  }

  const imageWithAttribution = migration.editContentType('imageWithAttribution');

  imageWithAttribution.removeSidebarWidget('extension', 'europeanaImageHarvester');
  // "Image harvester - Europeana" app (pre-installed in space & env)
  imageWithAttribution.addSidebarWidget('app',  process.env.IMAGE_HARVESTER_APP_ID, {}, 'content-preview-widget');
};
