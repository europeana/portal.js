require('dotenv').config();

if (!process.env.SLUG_VALIDATION_APP_ID) {
  console.log('No app ID specified in SLUG_VALIDATION_APP_ID; aborting.');
  process.exit(1);
}

module.exports = function(migration) {
  const browsePage = migration.editContentType('browsePage');
  browsePage
    .editField('identifier')
    .required(true);

  // "Slug validation - Europeana" app (pre-installed in space & env)
  browsePage.changeFieldControl('identifier', 'app', process.env.SLUG_VALIDATION_APP_ID, {
    helpText: 'Do not include a leading slash. The homepage has slug "home". Should be unique for both browse and static pages',
    contentTypes: 'staticPage'
  });
};
