
module.exports = function(migration) {
  if (!process.env.DOCUMENT_LINKER_APP_ID) {
    console.log('No app ID specified in DOCUMENT_LINKER_APP_ID; aborting.');
    process.exit(1);
  }

  if (!process.env.DOCUMENT_LINKER_FILESERVER_URL) {
    console.log('No url specified in DOCUMENT_LINKER_FILESERVER_URL; aborting.');
    process.exit(1);
  }

  const project = migration.editContentType('project');

  project
    .createField('reportsLink')
    .name('Reports Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  project.changeFieldControl('reportsLink', 'app', process.env.DOCUMENT_LINKER_APP_ID, { url: process.env.DOCUMENT_LINKER_FILESERVER_URL });

  project
    .createField('factsheetLink')
    .name('Factsheet Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  project.changeFieldControl('factsheetLink', 'app', process.env.DOCUMENT_LINKER_APP_ID, { url: process.env.DOCUMENT_LINKER_FILESERVER_URL });
};
