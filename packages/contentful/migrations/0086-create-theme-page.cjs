module.exports = function(migration) {
  const themePage = migration
    .createContentType('themePage')
    .name('Theme page')
    .description('Theme entity page')
    .displayField('title');

  themePage
    .createField('title')
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

  themePage.changeFieldControl('title', 'builtin', 'singleLine', {});

  themePage
    .createField('identifier')
    .name('URL slug')
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

  themePage.changeFieldControl('identifier', 'builtin', 'slugEditor', {
    helpText: 'Will always be prefixed with "/themes/"'
  });

  themePage
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .disabled(false)
    .omitted(false);

  themePage
    .changeFieldControl('description', 'builtin', 'singleLine', {
      helpText: 'For SEO, please make sure there is a short description.'
    });

  themePage
    .createField('primaryImageOfPage')
    .name('Featured image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['imageWithAttribution']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  themePage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {
      helpText: 'Used for link cards and badges and social media image'
    }
  );

  themePage
    .createField('relatedTopics')
    .name('Related topics')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['cardGroup']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  themePage
    .createField('relatedPeople')
    .name('Related people')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['cardGroup']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  themePage
    .createField('relatedStories')
    .name('Related stories')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['cardGroup']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  themePage
    .createField('relatedGalleries')
    .name('Related galleries')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['cardGroup']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  themePage
    .createField('callToAction')
    .name('Call to action')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['primaryCallToAction']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  themePage
    .createField('curatedItems')
    .name('Curated items')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['cardGroup']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};
