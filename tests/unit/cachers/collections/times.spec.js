import nock from 'nock';

const cacher = require('@/cachers/collections/times');

const apiResponse = {
  pageOne: {
    items: [{
      id: 'http://data.europeana.eu/timespan/1',
      type: 'timespan',
      identifier: ['1'],
      prefLabel: {
        en: '1st century'
      },
      isShownBy: 'http://www.example.eu'
    },
    {
      id: 'http://data.europeana.eu/timespan/2',
      type: 'timespan',
      identifier: ['2'],
      prefLabel: {
        en: '10th century'
      },
      isShownBy: 'http://www.example.eu'
    },
    {
      id: 'http://data.europeana.eu/timespan/3',
      type: 'timespan',
      identifier: ['3'],
      prefLabel: {
        en: '2nd century'
      },
      isShownBy: 'http://www.example.eu'
    }]
  },
  pageTwo: {}
};

const dataToCache = [
  {
    id: 'http://data.europeana.eu/timespan/1',
    prefLabel: {
      en: '1st century'
    },
    isShownBy: 'http://www.example.eu',
    slug: '1-1st-century'
  },
  {
    id: 'http://data.europeana.eu/timespan/3',
    prefLabel: {
      en: '2nd century'
    },
    isShownBy: 'http://www.example.eu',
    slug: '3-2nd-century'
  },
  {
    id: 'http://data.europeana.eu/timespan/2',
    prefLabel: {
      en: '10th century'
    },
    isShownBy: 'http://www.example.eu',
    slug: '2-10th-century'
  }
];

const config = {
  europeana: {
    apis: {
      entity: {
        url: 'https://api.example.org/entity',
        key: 'entityApiKey'
      }
    }
  }
};

describe('cachers/collections/times', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === 'timespan' && query.scope === 'europeana' && query.page === '0')
      .reply(200, apiResponse.pageOne);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === 'timespan' && query.scope === 'europeana' && query.page === '1')
      .reply(200, apiResponse.pageTwo);
  });

  afterEach('restore utility methods', () => {
    nock.cleanAll();
  });

  describe('.data', () => {
    it('returns chronologically sorted centuries to cache', async() => {
      const data = await cacher.data(config);

      data.should.eql(dataToCache);
    });
  });
});
