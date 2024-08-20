module.exports = function(migration) {
  const voteableFeature = migration
    .createContentType('voteableFeature')
    .name('Feature')
    .description(
      'A feature that users can vote on.'
    )
    .displayField('name');

  voteableFeature
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([{ size: { max: 100 },
      message: 'Text must be max. 100 characters.' }])
    .disabled(false)
    .omitted(false);

  voteableFeature
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([{ size: { max: 300 },
      message: 'Text must be max. 300 characters.' }])
    .disabled(false)
    .omitted(false);

  voteableFeature
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['illustration']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  voteableFeature.changeFieldControl('text', 'builtin', 'markdown', {});

  const featureIdeasPage = migration
    .createContentType('featureIdeasPage')
    .name('Feature ideas page')
    .description(
      'The Feature ideas page.'
    )
    .displayField('name');

  featureIdeasPage
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true
      },
      {
        size: {
          max: 100
        },

        message:
          'This is an H1 field, it needs to be unique for SEO and not more than 100 characters.'
      }
    ])
    .disabled(false)
    .omitted(false);

  featureIdeasPage
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  featureIdeasPage.changeFieldControl('text', 'builtin', 'markdown', {});

  featureIdeasPage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  featureIdeasPage.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'For SEO, please make sure there is a short description.'
  });

  featureIdeasPage
    .createField('image')
    .name('Social media image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  featureIdeasPage
    .createField('hasPart')
    .name('Sections')
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
          linkContentType: ['voteableFeature']
        }
      ],
      linkType: 'Entry'
    });
};
