module.exports = function(migration) {
  const automatedEntityCard = migration.editContentType('automatedEntityCard');
  automatedEntityCard
    .addSidebarWidget('extension', 'europeanaEntityHarvester', {}, 'content-preview-widget');

  const entityPage = migration.editContentType('entityPage');
  entityPage
    .addSidebarWidget('extension', 'europeanaEntityHarvester', {}, 'content-preview-widget');

  const heroBanner = migration.editContentType('heroBanner');
  heroBanner
    .addSidebarWidget('extension', 'europeanaImageHarvester', {}, 'content-preview-widget');
};
