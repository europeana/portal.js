
module.exports = function(migration) {
  if (!process.env.DOCUMENT_LINKER_APP_ID) {
    console.log('No app ID specified in DOCUMENT_LINKER_APP_ID; aborting.');
    process.exit(1);
  }

  if (!process.env.DOCUMENT_LINKER_FILESERVER_URL) {
    console.log('No url specified in DOCUMENT_LINKER_FILESERVER_URL; aborting.');
    process.exit(1);
  }

  const documentLinkSection = migration
    .createContentType('documentLinkSection')
    .name('Document Link Section')
    .description(
      'Section'
    )
    .displayField('identifier');

  documentLinkSection
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

  documentLinkSection
    .createField('headline')
    .name('Label')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  documentLinkSection
    .createField('link')
    .name('Link')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  documentLinkSection.changeFieldControl(
    'identifier',
    'builtin',
    'singleLine',
    {
      helpText: 'For editorial context only.'
    }
  );

  documentLinkSection.changeFieldControl('link', 'app', process.env.DOCUMENT_LINKER_APP_ID, { url: process.env.DOCUMENT_LINKER_FILESERVER_URL });

  const blogPosting = migration.editContentType('blogPosting');

  blogPosting
    .editField('hasPart').items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'documentLinkSection', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText']
        }
      ],
      linkType: 'Entry'
    });
};
