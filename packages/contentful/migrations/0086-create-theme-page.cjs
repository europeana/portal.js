require('dotenv').config();

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

  const topicGroup = migration
    .createContentType('topicGroup')
    .name('Topic group')
    .description('List of topic entity id\'s')
    .displayField('title');

  topicGroup
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  topicGroup.changeFieldControl('title', 'builtin', 'singleLine', {});

  topicGroup.createField('topics')
    .name('Topics')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 9
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern: '^http://data.europeana.eu/concept/(base/)?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  topicGroup.changeFieldControl('topics', 'app', process.env.ENTITY_SUGGEST_APP_ID);

  themePage.createField('relatedTopics')
    .name('Related topics')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['topicGroup']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  const personGroup = migration
    .createContentType('personGroup')
    .name('Person group')
    .description('List of person entity id\'s')
    .displayField('title');

  personGroup
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  personGroup.changeFieldControl('title', 'builtin', 'singleLine', {});

  personGroup.createField('persons')
    .name('Persons')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 8
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern: '^http://data.europeana.eu/agent/(base/)?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  personGroup.changeFieldControl('persons', 'app', process.env.ENTITY_SUGGEST_APP_ID);

  themePage.createField('relatedPersons')
    .name('Related persons')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['personGroup']
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

  const galleryGroup = migration
    .createContentType('galleryGroup')
    .name('Gallery group')
    .description('List of gallery set id\'s')
    .displayField('title');

  galleryGroup
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .disabled(false)
    .omitted(false);

  galleryGroup.changeFieldControl('title', 'builtin', 'singleLine', {});

  galleryGroup.createField('galleries')
    .name('galleries')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 4
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern: '^http://data.europeana.eu/set/?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  // TODO: Use set suggest app when available
  // galleryGroup.changeFieldControl('gallerys', 'app', process.env.SET_SUGGEST_APP_ID);

  themePage.createField('relatedGalleries')
    .name('Related galleries')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['galleryGroup']
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
