
module.exports = function(migration) {
  const contactGroup = migration.createContentType('contactGroup')
    .name('People Section')
    .description(
      'Grouping of europeana contacts. Aggregates person entries.'
    )
    .displayField('identifier');

  contactGroup
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

  contactGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  contactGroup
    .createField('hasPart')
    .name('People')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['person']
        }
      ],

      linkType: 'Entry'
    });

  contactGroup.changeFieldControl(
    'identifier',
    'builtin',
    'singleLine',
    {
      helpText: 'For editorial context only.'
    }
  );

  const blogPosting = migration.editContentType('blogPosting');

  blogPosting
    .editField('hasPart').items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['cardGroup', 'documentLinkSection', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'contactGroup', 'richText']
        }
      ],
      linkType: 'Entry'
    });

  const landingPage = migration.editContentType('landingPage');

  landingPage.editField('hasPart').items({
    type: 'Link',
    validations: [
      {
        linkContentType: [
          'cardGroup',
          'embedSection',
          'illustrationGroup',
          'imageCard',
          'imageCardGroup',
          'infoCardGroup',
          'landingSubSection',
          'contactGroup',
          'primaryCallToAction',
          'testimonialCardGroup'
        ]
      }
    ],
    linkType: 'Entry'
  });

  const landingSubSection = migration.editContentType('landingSubSection');

  landingSubSection.editField('hasPart').items({
    type: 'Link',
    validations: [
      {
        linkContentType: [
          'automatedCardGroup',
          'cardGroup',
          'illustrationGroup',
          'infoCardGroup',
          'imageCard',
          'contactGroup',
          'testimonialCardGroup'
        ]
      }
    ],

    linkType: 'Entry'
  });
};
