module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  if (!process.env.CATEGORY_SUGGEST_APP_ID) {
    console.log('No app ID specified in CATEGORY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const project = migration
    .createContentType('project')
    .name('Project')
    .description('Data space project')
    .displayField('name');

  project
    .createField('name')
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

  project
    .createField('logo')
    .name('Logo')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['illustration']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  project
    .createField('startDate')
    .name('Start date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  project
    .createField('endDate')
    .name('End date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  project
    .createField('goals')
    .name('Goals')
    .type('Text')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          max: 800
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('testimonial')
    .name('Testimonial')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['testimonialCard']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  project
    .createField('partners')
    .name('Partners')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          max: 3000
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('partnerEntities')
    .name('Partner institutions')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          regexp: {
            pattern: '^http://data.europeana.eu/(organization)/(base/)?[0-9]+$',
            flags: null
          }
        }
      ]
    });

  project
    .createField('fundingStream')
    .name('Funding Stream')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['link']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  project
    .createField('contractNumber')
    .name('Contract Number')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 200
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('fundingLogos')
    .name('Funders')
    .type('Array')
    .localized(false)
    .required(true)
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
          linkContentType: ['illustration']
        }
      ],

      linkType: 'Entry'
    });

  project
    .createField('impactMetrics')
    .name('Impact')
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
      type: 'Symbol',
      validations: [
        {
          regexp: {
            pattern: '^.*:.*$'
          },
          message:
            'Must include a ":" separator for the impact title and value.'
        }
      ]
    });

  project
    .createField('reports')
    .name('Reports')
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
          linkMimetypeGroup: ['pdfdocument']
        }
      ],
      linkType: 'Asset'
    });

  project
    .createField('factSheet')
    .name('Fact sheet')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['pdfdocument']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  project.changeFieldControl('name', 'builtin', 'singleLine', {});
  project.changeFieldControl('logo', 'builtin', 'entryLinkEditor', {});
  project.changeFieldControl('startDate', 'builtin', 'datePicker', {});
  project.changeFieldControl('endDate', 'builtin', 'datePicker', {});

  project.changeFieldControl('goals', 'builtin', 'markdown', {
    helpText: 'Recommended format is a list of bullet points.'
  });

  project.changeFieldControl(
    'testimonial',
    'builtin',
    'entryLinkEditor',
    {}
  );

  project.changeFieldControl('partners', 'builtin', 'markdown', {
    helpText: 'Freetext, recommended to be a list (" - NAME"/"1. NAME" syntax)'
  });

  project.changeFieldControl('partnerEntities', 'app', process.env.ENTITY_SUGGEST_APP_ID, {
    helpText:
      'Only accepts institutions/organisation entities. Will be appended to the freetext as a list.'
  });

  project.changeFieldControl('fundingStream', 'builtin', 'entryLinkEditor', {});
  project.changeFieldControl('contractNumber', 'builtin', 'singleLine', {});
  project.changeFieldControl('fundingLogos', 'builtin', 'entryLinksEditor', {});

  project.changeFieldControl('impactMetrics', 'builtin', 'tagEditor', {
    helpText:
      'Include a ":" separator between the label and value for each metric. "Label:Value"'
  });

  project.changeFieldControl('reports', 'builtin', 'assetLinksEditor', {});
  project.changeFieldControl('factSheet', 'builtin', 'assetLinkEditor', {});

  const projectPage = migration
    .createContentType('projectPage')
    .name('Project Page')
    .description(
      'Project page page used on the dataspace website.'
    )
    .displayField('name');

  projectPage
    .createField('name')
    .name('Title')
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

  projectPage
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

  projectPage
    .createField('image')
    .name('Social media image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image']
      },
      {
        assetImageDimensions: {
          width: {
            min: 300,
            max: null
          },

          height: {
            min: 250,
            max: null
          }
        },

        message: 'Please make sure the image is at least 300x250px'
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  projectPage
    .createField('primaryImageOfPage')
    .name('Main image')
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

  projectPage
    .createField('headline')
    .name('Subtitle/teaser text')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          max: 400
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  projectPage
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          max: 1500
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  projectPage
    .createField('project')
    .name('Project')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['project']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  projectPage
    .createField('categories')
    .name('Categories')
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
          linkContentType: ['category']
        }
      ],

      linkType: 'Entry'
    });

  projectPage.changeFieldControl('project', 'builtin', 'entryCardEditor', {});
  projectPage.changeFieldControl('name', 'builtin', 'singleLine', {});
  projectPage.changeFieldControl('identifier', 'builtin', 'slugEditor', {});
  projectPage.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  projectPage.changeFieldControl(
    'primaryImageOfPage',
    'builtin',
    'entryLinkEditor',
    {}
  );

  projectPage.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText:
      'Shows on the preview card. Must be less than 140 Characters to not be truncated.'
  });

  projectPage.changeFieldControl('description', 'builtin', 'markdown', {
    helpText: 'For SEO, please make sure there is a short description.'
  });

  projectPage.changeFieldControl('categories', 'app', process.env.CATEGORY_SUGGEST_APP_ID);
};
