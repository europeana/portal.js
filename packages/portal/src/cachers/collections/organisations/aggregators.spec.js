import * as cacher from '@/cachers/collections/organisations/aggregators.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';
import nock from 'nock';

const countryLabel = 'France';
const slug = '001-museum';
const searchResponse = [
  { id: 'http://data.europeana.eu/organization/001', slug },
  { id: 'http://data.europeana.eu/organization/002' }
];

const domain = ['Film heritage'];
const retrieveResponse = {
  items: [
    {
      id: 'http://data.europeana.eu/organization/001',
      geographicScope: 'National',
      type: 'Aggregator',
      prefLabel: { en: 'Museum', es: 'Museo' },
      country: { prefLabel: countryLabel },
      isAggregatedBy: { recordCount: 100 }
    },
    {
      id: 'http://data.europeana.eu/organization/002',
      geographicScope: 'International',
      heritageDomain: domain,
      type: 'Aggregator',
      prefLabel: { en: 'Gallery' },
      isAggregatedBy: { recordCount: 100 }
    }
  ]
};

const context = {
  $config: {
    europeana: {
      apis: {
        entity: {
          url: 'https://api.example.org/entity',
          key: 'entityApiKey'
        }
      }
    }
  }
};

const mockApiRequests = () => {
  nock(context.$config.europeana.apis.entity.url)
    .post('/retrieve')
    .query(query => query.wskey === context.$config.europeana.apis.entity.key)
    .reply(200, retrieveResponse);
};

describe('@/cachers/collections/aggregators', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  beforeEach(() => {
    mockApiRequests();
  });
  afterEach(() => {
    nock.cleanAll();
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.resetBehavior();
  });

  sinon.stub(baseCacher, 'default')
    .resolves(searchResponse);

  it('fetches data with type: aggregator', async() => {
    await cacher.data(context);

    expect(baseCacher.default.calledWith({ type: 'aggregator' }, context)).toBe(true);
  });

  it('adds the heritage domain to the organisation data', async() => {
    const data = await cacher.data(context);

    expect(data[1].heritageDomain).toEqual(domain);
  });

  it('adds the country pref label to the organisation data', async() => {
    const data = await cacher.data(context);

    expect(data[0].countryPrefLabel).toEqual(countryLabel);
  });

  it('keeps the slug for the organisation data', async() => {
    const data = await cacher.data(context);

    expect(data[0].slug).toEqual(slug);
  });

  it('picks specific fields', () => {
    expect(cacher.PICK).toEqual(['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo']);
  });

  it('localises countryPrefLabel', () => {
    expect(cacher.LOCALISE).toEqual('countryPrefLabel');
  });
});
