module.exports = function(migration) {
  // Removes reference to "home" as the URL slug for the homepage.
  const helpText = 'Do not include a leading slash. Should be unique for both browse and static pages';

  const staticPage = migration.editContentType('staticPage');
  staticPage.changeFieldControl('identifier', 'app', process.env.SLUG_VALIDATION_APP_ID, {
    helpText,
    contentTypes: 'browsePage'
  });

  const browsePage = migration.editContentType('browsePage');
  browsePage.changeFieldControl('identifier', 'app', process.env.SLUG_VALIDATION_APP_ID, {
    helpText,
    contentTypes: 'staticPage'
  });
};
