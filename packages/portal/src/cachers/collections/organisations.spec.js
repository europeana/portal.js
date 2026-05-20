import * as cacher from '@/cachers/collections/organisations.js';
import * as baseCacher from '@/cachers/collections/index.js';
import countryCodes from 'i18n-iso-countries';
import sinon from 'sinon';
import nock from 'nock';

const organisations = [
  {
    id: 'http://data.europeana.eu/organization/001',
    type: 'Organization',
    prefLabel: { en: 'Museum', es: 'Museo' },
    country: 'ES',
    isAggregatedBy: { recordCount: 100 }
  },
  {
    id: 'http://data.europeana.eu/organization/002',
    type: 'Organization',
    prefLabel: { en: 'Gallery' },
    country: 'http://data.europeana.eu/place/001'
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

const apiPlaceResponse = {
  prefLabel: { en: 'France' }
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

const mockPlaceRequest = () => {
  nock(config.europeana.apis.entity.url)
    .get('/place/001.json')
    .query(query => query.wskey === config.europeana.apis.entity.key)
    .reply(200, apiPlaceResponse);
};

const mockApiRequests = () => {
  mockPlaceRequest();
};

describe('@/cachers/collections/organisations', () => {
  beforeEach(() => {
    mockApiRequests();
  });
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });
  sinon.stub(baseCacher, 'default').resolves(organisations);
  sinon.stub(countryCodes, 'getName').withArgs('ES', 'en', { select: 'official' }).returns('Spain');

  it('fetches data with type: organization', async() => {
    await cacher.data(config);

    expect(baseCacher.default.calledWith({ type: 'organization' }, config)).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug, recordCount and prefLabel', () => {
    expect(cacher.PICK).toEqual(['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'countryPrefLabel']);
  });

  it('localises countryPrefLabel', () => {
    expect(cacher.LOCALISE).toEqual('countryPrefLabel');
  });

  describe('prefLabel', () => {
    it('is reduced to the native language', async() => {
      const organisationData = await cacher.data(config);

      expect(organisationData[0].prefLabel).toEqual({ es: 'Museo' });
    });
  });

  describe('altLabel', () => {
    it('is taken from the non-native English language prefLabel', async() => {
      const organisationData = await cacher.data(config);

      expect(organisationData[0].altLabel).toEqual({ en: 'Museum' });
    });
  });

  describe('recordCount', () => {
    it('is set from isAggregatedBy.recordCount', async() => {
      const organisationData = await cacher.data(config);

      expect(organisationData[0].recordCount).toBe(100);
    });

    it('falls back to 0', async() => {
      const organisationData = await cacher.data(config);

      expect(organisationData[1].recordCount).toBe(0);
    });
  });

  describe('countryPrefLabel', () => {
    describe('when the country on the organisation entity is an entity reference', () => {
      it('fetches the place entity prefLabel', async() => {
        const organisationData = await cacher.data(config);

        expect(organisationData[1].countryPrefLabel).toEqual(apiPlaceResponse.prefLabel);
      });
    });

    describe('when the country on the organisation entity is a full entity', () => {
      it('uses prefLabel from the entity', async() => {
        const organisationData = await cacher.data(config);

        expect(organisationData[3].countryPrefLabel).toEqual({ en: 'Germany' });
      });
    });

    describe('when the country on the organisation entity is a language code', () => {
      it('fetches the place entity prefLabel', async() => {
        const organisationData = await cacher.data(config);

        expect(organisationData[0].countryPrefLabel).toEqual({ en: 'Spain' });
      });
    });

    describe('when there is no country on the organisation entity', () => {
      it('does not include a countryPrefLabel', async() => {
        const organisationData = await cacher.data(config);

        expect(organisationData[2].countryPrefLabel).toEqual(undefined);
      });
    });
  });
});
