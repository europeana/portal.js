import nock from 'nock';

const cacher = require('@/cachers/collections/organisations');

const apiResponse = {
  pageOne: {
    items: [{
      id: 'http://data.europeana.eu/organization/1',
      type: 'Organization',
      identifier: ['1'],
      prefLabel: {
        en: 'One'
      }
    }]
  },
  pageTwo: {
    items: [{
      id: 'http://data.europeana.eu/organization/2',
      type: 'Organization',
      identifier: ['2'],
      prefLabel: {
        en: 'Two'
      }
    }]
  },
  pageThree: {}
};

const dataToCache = [
  {
    id: 'http://data.europeana.eu/organization/1',
    prefLabel: { en: 'One' },
    slug: '1-one'
  },
  {
    id: 'http://data.europeana.eu/organization/2',
    prefLabel: { en: 'Two' },
    slug: '2-two'
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

describe('cachers/collections/organisations', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === 'organization' && query.scope === 'europeana' && query.page === '0')
      .reply(200, apiResponse.pageOne);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === 'organization' && query.scope === 'europeana' && query.page === '1')
      .reply(200, apiResponse.pageTwo);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.type === 'organization' && query.scope === 'europeana' && query.page === '2')
      .reply(200, apiResponse.pageThree);
  });

  afterEach('restore utility methods', () => {
    nock.cleanAll();
  });

  describe('.data', () => {
    it('paginates over organisations', async() => {
      await cacher.data(config);

      nock.isDone().should.be.true;
    });

    it('returns organisations to cache', async() => {
      const data = await cacher.data(config);

      data.should.eql(dataToCache);
    });
  });
});
