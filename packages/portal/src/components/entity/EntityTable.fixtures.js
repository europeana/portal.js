const propsData = {
  organisations: { type: 'organisations' },
  organisationsWithAggregatedVia: { type: 'organisations', fields: ['aggregator'] }
};

const backend = {
  collections: {
    organisations: [
      {
        id: 'http://data.europeana.eu/organization/001',
        slug: '001-museum',
        prefLabel: { de: 'museum' },
        altLabel: { en: 'museum' },
        countryPrefLabel: 'Deutschland'
      },
      {
        id: 'http://data.europeana.eu/organization/002',
        slug: '002-library',
        prefLabel: { nl: 'bibliotheek' },
        altLabel: { en: 'library' },
        countryPrefLabel: 'Nederland'
      }
    ],
    organisationsWithAggregatedVia: [
      {
        id: 'http://data.europeana.eu/organization/001',
        slug: '001-museum',
        prefLabel: { de: 'museum' },
        altLabel: { en: 'museum' },
        countryPrefLabel: 'Deutschland',
        aggregatedVia: ['http://data.europeana.eu/organization/003']
      },
      {
        id: 'http://data.europeana.eu/organization/002',
        slug: '002-library',
        prefLabel: { nl: 'bibliotheek' },
        altLabel: { en: 'library' },
        countryPrefLabel: 'Nederland',
        aggregatedVia: ['http://data.europeana.eu/organization/004', 'http://data.europeana.eu/organization/005']
      }
    ]
  },
  'collections/retrieve': {
    aggregators: [
      { id: 'http://data.europeana.eu/organization/003', prefLabel: 'Three' },
      { id: 'http://data.europeana.eu/organization/004', prefLabel: 'Four' },
      { id: 'http://data.europeana.eu/organization/005', prefLabel: 'Five' }
    ]
  }
};

const frontend = {
  organisations: [
    {
      id: 'http://data.europeana.eu/organization/001',
      slug: '001-museum',
      numericId: '001',
      prefLabel: 'museum',
      prefLabelLang: 'de',
      altLabel: 'museum',
      altLabelLang: 'en',
      countryPrefLabel: 'Deutschland'
    },
    {
      id: 'http://data.europeana.eu/organization/002',
      slug: '002-library',
      numericId: '002',
      prefLabel: 'bibliotheek',
      prefLabelLang: 'nl',
      altLabel: 'library',
      altLabelLang: 'en',
      countryPrefLabel: 'Nederland'
    }
  ],
  organisationsWithAggregatedVia: [
    {
      id: 'http://data.europeana.eu/organization/001',
      slug: '001-museum',
      numericId: '001',
      prefLabel: 'museum',
      prefLabelLang: 'de',
      altLabel: 'museum',
      altLabelLang: 'en',
      countryPrefLabel: 'Deutschland',
      aggregatedVia: [
        { id: 'http://data.europeana.eu/organization/003', prefLabel: 'Three' }
      ]
    },
    {
      id: 'http://data.europeana.eu/organization/002',
      slug: '002-library',
      numericId: '002',
      prefLabel: 'bibliotheek',
      prefLabelLang: 'nl',
      altLabel: 'library',
      altLabelLang: 'en',
      countryPrefLabel: 'Nederland',
      aggregatedVia: [
        { id: 'http://data.europeana.eu/organization/004', prefLabel: 'Four' },
        { id: 'http://data.europeana.eu/organization/005', prefLabel: 'Five' }
      ]
    }
  ]
};

export const fixtures = {
  backend,
  frontend,
  propsData
};
