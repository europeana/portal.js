import * as cacher from '@/cachers/collections/organisations.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';
import nock from 'nock';

const organisations = [
  {
    id: 'http://data.europeana.eu/organization/001',
    type: 'Organization',
    prefLabel: { en: 'Museum', es: 'Museo' },
    isAggregatedBy: { recordCount: 100 }
  },
  {
    id: 'http://data.europeana.eu/organization/002',
    type: 'Organization',
    prefLabel: { en: 'Gallery' },
    country: { id: 'http://data.europeana.eu/place/001', prefLabel: { en: 'France' } }
  },
  {
    id: 'http://data.europeana.eu/organization/003',
    type: 'Organization',
    prefLabel: { en: 'Archive' }
  },
  {
    id: 'http://data.europeana.eu/organization/004',
    type: 'Organization',
    prefLabel: { en: 'Library' },
    country: { id: 'http://data.europeana.eu/place/002', prefLabel: { en: 'Germany' } }
  }
];

describe('@/cachers/collections/organisations', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });
  sinon.stub(baseCacher, 'default').resolves(organisations);

  it('fetches data with type: organization', async() => {
    await cacher.data({});

    expect(baseCacher.default.calledWith({ type: 'organization' }, {})).toBe(true);
    sinon.resetHistory();
  });

  it('picks required fields', () => {
    expect(cacher.PICK).toEqual(['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'countryPrefLabel', 'aggregatedVia']);
  });

  it('localises countryPrefLabel', () => {
    expect(cacher.LOCALISE).toEqual('countryPrefLabel');
  });

  describe('prefLabel', () => {
    it('is reduced to the native language', async() => {
      const organisationData = await cacher.data({});

      expect(organisationData[0].prefLabel).toEqual({ es: 'Museo' });
    });
  });

  describe('altLabel', () => {
    it('is taken from the non-native English language prefLabel', async() => {
      const organisationData = await cacher.data({});

      expect(organisationData[0].altLabel).toEqual({ en: 'Museum' });
    });
  });

  describe('recordCount', () => {
    it('is set from isAggregatedBy.recordCount', async() => {
      const organisationData = await cacher.data({});

      expect(organisationData[0].recordCount).toBe(100);
    });

    it('falls back to 0', async() => {
      const organisationData = await cacher.data({});

      expect(organisationData[1].recordCount).toBe(0);
    });
  });
});
