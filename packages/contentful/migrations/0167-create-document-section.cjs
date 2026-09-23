
module.exports = function(migration) {
  if (!process.env.DOCUMENT_LINKER_APP_ID) {
    console.log('No app ID specified in DOCUMENT_LINKER_APP_ID; aborting.');
    process.exit(1);
  }

  if (!process.env.DOCUMENT_LINKER_FILESERVER_URL) {
    console.log('No url specified in DOCUMENT_LINKER_FILESERVER_URL; aborting.');
    process.exit(1);
  }

  const documentSection = migration
    .createContentType('documentSection')
    .name('Document Section')
    .description(
      'Section'
    )
    .displayField('identifier');

  documentSection
    .createField('identifier')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true
      }
    ])
    .disabled(false)
    .omitted(false);

  documentSection
    .createField('headline')
    .name('Label')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  documentSection
    .createField('target')
    .name('Target')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  documentSection.changeFieldControl(
    'identifier',
    'builtin',
    'singleLine',
    {
      helpText: 'For editorial context only.'
    }
  );

  documentSection.changeFieldControl('target', 'app', process.env.DOCUMENT_LINKER_APP_ID, { url: process.env.DOCUMENT_LINKER_FILESERVER_URL });

  const blogPosting = migration.editContentType('blogPosting');

  blogPosting
    .editField('hasPart').items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'documentSection', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],
      linkType: 'Entry'
    });
};
