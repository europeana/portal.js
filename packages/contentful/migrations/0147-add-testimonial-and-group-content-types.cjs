module.exports = async function(migration) {
  const testimonialCard = migration
    .createContentType('testimonialCard')
    .name('Testimonial card')
    .description('Card with a quote and quote attribution')
    .displayField('name');

  testimonialCard
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  testimonialCard.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText:
      'Title will not be displayed on the website, but useful for findability in Contentful'
  });

  testimonialCard
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: { max: 500 },
        message: 'Testimonial text should be 250 - 400 characters.'
      }
    ])
    .disabled(false)
    .omitted(false);

  testimonialCard
    .createField('attribution')
    .name('Testimonial attribution')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([
      {
        size: { max: 80 },
        message: 'Testimonial attribution should be max. 70 characters.'
      }
    ])
    .disabled(false)
    .omitted(false);

  const testimonialCardGroup = migration
    .createContentType('testimonialCardGroup')
    .name('Testimonial card group')
    .description('Section with text and grouped testimonial cards')
    .displayField('name');

  testimonialCardGroup
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      { size: { max: 50 }, message: 'Title should be max. 30 characters.' }
    ])
    .disabled(false)
    .omitted(false);

  testimonialCardGroup
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      { size: { max: 250 }, message: 'Text should be max. 230 characters.' }
    ])
    .disabled(false)
    .omitted(false);

  testimonialCardGroup
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 3,
          max: 3
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['testimonialCard']
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
          'cardGroup',
          'automatedCardGroup',
          'illustrationGroup',
          'infoCardGroup',
          'imageCard',
          'testimonialCardGroup'
        ]
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
          'primaryCallToAction',
          'testimonialCardGroup'
        ]
      }
    ],
    linkType: 'Entry'
  });
};
