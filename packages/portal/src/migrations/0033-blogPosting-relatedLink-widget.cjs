module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const blogPosting = migration.editContentType('blogPosting');

  // "Entity suggest - Europeana" app (pre-installed in space & env)
  blogPosting.changeFieldControl('relatedLink', 'app', process.env.ENTITY_SUGGEST_APP_ID);
};
