import * as cacher from '@/cachers/collections/organisations/aggregators.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';
import nock from 'nock';

const countryLabel = 'France';
const slug = '001-museum';
const searchResponse = [
  { id: 'http://data.europeana.eu/organization/001', slug, country: { id: 'http://data.europeana.eu/place/100' } },
  { id: 'http://data.europeana.eu/organization/002' }
];

const domain = ['Film heritage'];
const retrieveResponse = [
  {
    id: 'http://data.europeana.eu/organization/001',
    geographicScope: 'National',
    type: 'Aggregator',
    prefLabel: { en: 'Museum', es: 'Museo' },
    country: { id: 'http://data.europeana.eu/place/100', prefLabel: countryLabel },
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
];

const context = {
  $apis: {
    entity: {
      retrieve: sinon.stub().resolves(retrieveResponse)
    }
  }
};

describe('@/cachers/collections/aggregators', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
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

  it('retrieves full entity data from the API', async() => {
    await cacher.data(context);

    expect(context.$apis.entity.retrieve.calledWith(
      [
        'http://data.europeana.eu/organization/001',
        'http://data.europeana.eu/organization/002'
      ],
      { profile: 'dereference' }
    )).toBe(true);
  });

  it('adds data from full entities to the organisation data', async() => {
    const data = await cacher.data(context);

    expect(data[1].heritageDomain).toEqual(domain);
  });

  it('keeps the slug for the organisation data', async() => {
    const data = await cacher.data(context);

    expect(data[0].slug).toEqual(slug);
  });

  it('picks specific fields', () => {
    expect(cacher.PICK).toEqual(['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo', 'aggregatesFrom']);
  });

  it('localises countryPrefLabel', () => {
    expect(cacher.LOCALISE).toEqual('countryPrefLabel');
  });
});
