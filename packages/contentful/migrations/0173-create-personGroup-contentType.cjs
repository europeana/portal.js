
module.exports = function(migration) {
  const personGroup = migration.createContentType('personGroup')
    .name('Person group')
    .description(
      'Group of person entries.'
    )
    .displayField('identifier');

  personGroup
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

  personGroup
    .createField('headline')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  personGroup
    .createField('text')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  personGroup.changeFieldControl('text', 'builtin', 'markdown', {});

  personGroup
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

  personGroup.changeFieldControl(
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
          linkContentType: ['cardGroup', 'documentLinkSection', 'embed', 'imageComparison', 'imageWithAttribution', 'link', 'personGroup', 'richText']
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
          'personGroup',
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
          'personGroup',
          'testimonialCardGroup'
        ]
      }
    ],

    linkType: 'Entry'
  });
};
