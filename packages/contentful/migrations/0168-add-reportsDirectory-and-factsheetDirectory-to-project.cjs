
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
    .createField('reportsDirectory')
    .name('Text')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  project.changeFieldControl('reportsDirectory', 'app', process.env.DOCUMENT_LINKER_APP_ID, { url: process.env.DOCUMENT_LINKER_FILESERVER_URL });

  project
    .createField('factsheetDirectory')
    .name('Text')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  project.changeFieldControl('factsheetDirectory', 'app', process.env.DOCUMENT_LINKER_APP_ID, { url: process.env.DOCUMENT_LINKER_FILESERVER_URL });
};
