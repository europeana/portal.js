module.exports = function(migration) {
  if (!process.env.ENTITY_SUGGEST_APP_ID) {
    console.log('No app ID specified in ENTITY_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  const project = migration
    .createContentType('project')
    .name('Project')
    .description(
      'Project page used on the dataspace website.'
    )
    .displayField('name');

  project
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

  project
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

  project
    .createField('logo')
    .name('Project Logo')
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

  project
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

  project
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
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          min: 10,
          max: 1500
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('goals')
    .name('Project goals')
    .type('Text')
    .localized(true)
    .required(true)
    .validations([
      {
        size: {
          min: 10,
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
    .name('Project partners')
    .type('Text')
    .localized(true)
    .required(false)
    .validations([
      {
        size: {
          min: 10,
          max: 3000
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('partnerEntities')
    .name('Project partner institutions')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
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
    .createField('contactNumber')
    .name('Contact Number')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 40
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('fundingLogo')
    .name('Funding logo')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['image']
      }
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  project
    .createField('fundingLogoUrl')
    .name('Funding logo URL')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          min: 6,
          max: 400
        }
      }
    ])
    .disabled(false)
    .omitted(false);

  project
    .createField('impactMetrics')
    .name('Impact')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 0,
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
            pattern: '^*:*$'
          },
          message: 'Must include a ":" separator for the impact title and value.'
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
          min: 0,
          max: 4
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

  project.changeFieldControl('identifier', 'builtin', 'slugEditor', {});

  project.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText:
      'Shows on the preview card. Must be less than 140 Characters to not be truncated.'
  });

  project.changeFieldControl('goals', 'builtin', 'markdown', {
    helpText:
      'Recommended format is a list of bullet points.'
  });

  project.changeFieldControl('partners', 'builtin', 'markdown', {
    helpText:
      'Freetext, should be a list (" - NAME" syntax) to allow appending entities.'
  });

  project.changeFieldControl('partnerEntities', 'app', process.env.ENTITY_SUGGEST_APP_ID, {
    helpText:
      'Only accepts instituions/organisation entities. Will be appended to the freetext list if that contains an unorderd list.'
  });
};
