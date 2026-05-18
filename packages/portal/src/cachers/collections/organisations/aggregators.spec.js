import * as cacher from '@/cachers/collections/organisations/aggregators.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';
import nock from 'nock';

const countryLabel = 'France';
const organisations = [
  { id: 'http://data.europeana.eu/organization/001', type: 'Aggregator', prefLabel: { en: 'Museum', es: 'Museo' }, country: { prefLabel: countryLabel }, isAggregatedBy: { recordCount: 100 } },
  { id: 'http://data.europeana.eu/organization/002', type: 'Aggregator', prefLabel: { en: 'Gallery' }, country: { prefLabel: countryLabel }, isAggregatedBy: { recordCount: 100 } }
];

const domain = ['Film heritage'];
const apiOrganizationResponses = {
  '001': {
    geographicScope: 'National',
    heritageDomain: domain
  },
  '002': {
    geographicScope: 'International',
    heritageDomain: domain
  }
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

const mockOrganizationRequest = (id) => {
  nock(config.europeana.apis.entity.url)
    .get(`/organization/${id}.json`)
    .query(query => query.wskey === config.europeana.apis.entity.key)
    .reply(200, apiOrganizationResponses[id]);
};

const mockApiRequests = () => {
  organisations.forEach((org) => {
    mockOrganizationRequest(org.id.split('/').pop());
  });
};

describe('@/cachers/collections/aggregators', () => {
  sinon.stub(baseCacher, 'default').resolves(organisations);

  it('fetches data with type: aggregator', async() => {
    mockApiRequests();
    await cacher.data(config);

    expect(baseCacher.default.calledWith({ type: 'aggregator' }, config)).toBe(true);
    sinon.resetHistory();
  });

  describe('when aggregator is international', () => {
    it('adds the heritage domain to the organisation data', async() => {
      mockApiRequests();
      const data = await cacher.data(config);

      expect(data[0].heritageDomain).toEqual(undefined);
      expect(data[1].heritageDomain).toEqual(domain);
      sinon.resetHistory();
    });
  });

  describe('when aggregator is NOT international', () => {
    it('adds the country pref label to the organisation data', async() => {
      mockApiRequests();
      const data = await cacher.data(config);

      expect(data[0].countryPrefLabel).toEqual(countryLabel);

      expect(data[1].countryPrefLabel).toEqual(undefined);
      sinon.resetHistory();
    });
  });

  it('picks slug, recordCount, prefLabel, geographicScope, heritageDomain, logo', () => {
    expect(cacher.PICK).toEqual(['id', 'slug', 'recordCount', 'prefLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo']);
  });

  it('localises countryPrefLabel', () => {
    expect(cacher.LOCALISE).toEqual('countryPrefLabel');
  });
});
