// TODO: create new item card group content type?
module.exports = async function(migration) {
  const themesModule = await import('@europeana/portal/src/plugins/europeana/themes.js');

  const themePage = migration
    .createContentType('themePage')
    .name('Theme page')
    .displayField('name');

  themePage
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

  themePage.changeFieldControl('name', 'builtin', 'singleLine', {});

  themePage
    .createField('identifier')
    .name('URL slug')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true
      },
      {
        in: themesModule.default.map((theme) => theme.id)
      }
    ])
    .disabled(false)
    .omitted(false);

  themePage.changeFieldControl('identifier', 'builtin', 'dropdown', {
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
    .createField('hasPart')
    .name('Sections')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          max: 10
        }
      }
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['topicGroup', 'personGroup', 'galleryGroup', 'primaryCallToAction', 'cardGroup']
        }
      ],

      linkType: 'Entry'
    });

  themePage.changeFieldControl(
    'hasPart',
    'builtin',
    'entryLinksEditor',
    {
      helpText: 'Additional automated content will be included alongside these curated sections.'
    }
  );
};
