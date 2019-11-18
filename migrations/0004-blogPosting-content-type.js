module.exports = function(migration) {
  const blogPosting = migration
    .createContentType('blogPosting')
    .name('Blog Post')
    .description('')
    .displayField('name');
  blogPosting
    .createField('name')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  blogPosting
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

  blogPosting
    .createField('description')
    .name('Description')
    .type('Symbol')
    .localized(true)
    .required(false)
    .disabled(false)
    .omitted(false);
  blogPosting
    .changeFieldControl('description', 'builtin', 'singleLine', {
      helpText: 'For SEO, please make sure there is a short description.'
    });

  blogPosting
    .createField('datePublished')
    .name('Publish at')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  blogPosting
    .createField('articleBody')
    .name('Body')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  blogPosting
    .createField('genre')
    .name('Categories')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: [
            'Archaeology',
            'Art',
            'Behind the scenes',
            'Competitions',
            'European Year Of Cultural Heritage',
            'Europeana',
            'Europeana 1914-1918',
            'Europeana 1989',
            'Fashion',
            'Industrial Heritage',
            'Inspired by Europeana',
            'Manuscripts',
            'Maps and Geography',
            'Migration',
            'Music',
            'Natural History',
            'News',
            'Newspapers',
            'Photography',
            'Sport'
          ]
        }
      ]
    });

  blogPosting
    .createField('keywords')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: []
    });

  blogPosting
    .createField('author')
    .name('Author(s)')
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

  blogPosting.changeFieldControl('name', 'builtin', 'singleLine', {});
  blogPosting.changeFieldControl('identifier', 'builtin', 'slugEditor', {});

  blogPosting.changeFieldControl('datePublished', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'timeZ'
  });

  blogPosting.changeFieldControl('articleBody', 'builtin', 'markdown', {});
  blogPosting.changeFieldControl('genre', 'builtin', 'checkbox', {});
  blogPosting.changeFieldControl('keywords', 'builtin', 'tagEditor', {});

  blogPosting.changeFieldControl('author', 'builtin', 'entryLinksEditor', {
    bulkEditing: false
  });
};
