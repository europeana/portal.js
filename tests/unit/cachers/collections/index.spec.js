import nock from 'nock';

import cacher from '@/cachers/collections/index.js';

const ENTITY_TYPE = 'timespan';
const ENTITY_SCOPE = 'europeana';

const apiResponse = {
  pageOne: {
    items: [
      {
        id: 'http://data.europeana.eu/timespan/1',
        prefLabel: {
          en: '1st century'
        },
        isShownBy: 'http://www.example.eu'
      },
      {
        id: 'http://data.europeana.eu/timespan/2',
        prefLabel: {
          en: '10th century'
        },
        isShownBy: 'http://www.example.eu'
      }
    ]
  },
  pageTwo: {
    items: [
      {
        id: 'http://data.europeana.eu/timespan/3',
        prefLabel: {
          en: '2nd century'
        },
        isShownBy: 'http://www.example.eu'
      }
    ]
  },
  pageThree: {}
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

const params = {
  type: ENTITY_TYPE
};

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

describe('cachers/collections/index', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === ENTITY_TYPE && query.scope === ENTITY_SCOPE && query.page === '0')
      .reply(200, apiResponse.pageOne);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === ENTITY_TYPE && query.scope === ENTITY_SCOPE && query.page === '1')
      .reply(200, apiResponse.pageTwo);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === ENTITY_TYPE && query.scope === ENTITY_SCOPE && query.page === '2')
      .reply(200, apiResponse.pageThree);
  });

  afterEach('restore utility methods', () => {
    nock.cleanAll();
  });

  describe('.data', () => {
    it('paginates over data', async() => {
      await cacher(params, config);

      nock.isDone().should.be.true;
    });

    it('returns data to cache, with numeric sorting', async() => {
      const data = await cacher(params, config);

      data.should.eql(dataToCache);
    });
  });
});
