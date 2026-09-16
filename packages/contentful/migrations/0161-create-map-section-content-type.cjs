module.exports = function (migration) {
  const mapSection = migration
    .createContentType('mapSection')
    .name('Map section')
    .description(
      'A content section which will display a map component.'
    )
    .displayField('name');

  mapSection
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  mapSection
    .createField('moreButton')
    .name('More Button')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['link']
      }
    ])
    .disabled(false)
    .omitted(false); 

  mapSection.changeFieldControl('name', 'builtin', 'singleLine', {});

  const browsePage = migration.editContentType('browsePage');

  browsePage
    .editField('hasPart')
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'richText', 'latestCardGroup', 'automatedCardGroup', 'primaryCallToAction', 'mapSection']
        }
      ],
      linkType: 'Entry'
    });
};
