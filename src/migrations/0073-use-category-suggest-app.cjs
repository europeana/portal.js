module.exports = function(migration) {
  if (!process.env.CATEGORY_SUGGEST_APP_ID) {
    console.log('No app ID specified in CATEGORY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  for (const contentTypeName of ['blogPosting', 'exhibitionPage']) {
    const contentType = migration.editContentType(contentTypeName);

    contentType.changeFieldControl('categories', 'app', process.env.CATEGORY_SUGGEST_APP_ID);
  }
};
