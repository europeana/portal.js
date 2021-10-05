module.exports = function(migration) {
  const primaryCallToAction = migration
    .createContentType('primaryCallToAction')
    .name('Primary call to action')
    .description('Call to action module with a free text field and a CTA button')
    .displayField('name');

  primaryCallToAction
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
        message: 'Title should be unique'
      }
    ])
    .disabled(false)
    .omitted(false);

  primaryCallToAction.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Title will not be displayed on the website, but useful for findability in Contentful'
  });

  primaryCallToAction
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  primaryCallToAction.changeFieldControl('text', 'builtin', 'markdown', {});

  primaryCallToAction
    .createField('CTAButton')
    .name('CTA Button')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([
      {
        linkContentType: ['link']
      }
    ])
    .disabled(false)
    .omitted(false);

  const staticPage = migration.editContentType('staticPage');

  staticPage
    .editField('hasPart')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['embed', 'imageComparison', 'imageWithAttribution', 'link', 'richText', 'primaryCallToAction']
        }
      ],

      linkType: 'Entry'
    });
};
