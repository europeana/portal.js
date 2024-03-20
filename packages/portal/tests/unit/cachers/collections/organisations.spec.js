import * as cacher from '@/cachers/collections/organisations.js';
import * as baseCacher from '@/cachers/collections/index.js';
import countryCodes from 'i18n-iso-countries';
import sinon from 'sinon';
import nock from 'nock';

const organisations = [
  { id: 'http://data.europeana.eu/organization/001', type: 'Organization', prefLabel: { en: 'Museum', es: 'Museo' }, country: 'ES' },
  { id: 'http://data.europeana.eu/organization/002', type: 'Organization', prefLabel: { en: 'Gallery' }, country: 'http://data.europeana.eu/place/001' },
  { id: 'http://data.europeana.eu/organization/002', type: 'Organization', prefLabel: { en: 'Archive' } }
];

const fields = [
  { label: 'http://data.europeana.eu/organization/001', count: 100 },
  { label: 'http://data.europeana.eu/organization/002', count: 200 },
  { label: 'http://data.europeana.eu/organization/003', count: 150 }
];

const apiFacetResponse = {
  facets: [{
    name: 'foaf_organization',
    fields
  }]
};

const apiPlaceResponse = {
  prefLabel: { en: 'France' }
};

const config = {
  europeana: {
    apis: {
      entity: {
        url: 'https://api.example.org/entity',
        key: 'entityApiKey'
      },
      record: {
        url: 'https://api.example.org/record',
        key: 'recordApiKey'
      }
    }
  }
};

const mockFacetRequest = () => {
  nock(config.europeana.apis.record.url)
    .get('/search.json')
    .query(query => (
      query.profile === 'facets' &&
        query.query === 'foaf_organization:*data.europeana.eu*' &&
        query.facet === 'foaf_organization' &&
        query['f.foaf_organization.facet.limit'] === '10000' &&
        query.rows === '0'
    ))
    .reply(200, apiFacetResponse);
};

const mockPlaceRequest = () => {
  nock(config.europeana.apis.entity.url)
    .get('/place/001.json')
    .query(query => query.wskey === config.europeana.apis.entity.key)
    .reply(200, apiPlaceResponse);
};

const mockApiRequests = () => {
  mockFacetRequest();
  mockPlaceRequest();
};

describe('@/cachers/collections/organisations', () => {
  sinon.stub(baseCacher, 'default').resolves(organisations);
  sinon.stub(countryCodes, 'getName').withArgs('ES', 'en', { select: 'official' }).returns('Spain');

  it('fetches data with type: organization', async() => {
    mockApiRequests();
    await cacher.data(config);

    expect(baseCacher.default.calledWith({ type: 'organization' }, config)).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug, recordCount and prefLabel', () => {
    expect(cacher.PICK).toEqual(['slug', 'recordCount', 'prefLabel', 'country', 'countryPrefLabel']);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBeUndefined();
  });

  describe('when there is no fields on the facets response', () => {
    it('recordCount falls back to 0', async() => {
      apiFacetResponse.facets[0].fields = null;
      mockApiRequests();
      const organisationData = await cacher.data(config);

      expect(organisationData[0].recordCount).toBe(0);
      apiFacetResponse.fields = fields;
    });
  });

  describe('when the country on the organisation entity is an entity reference', () => {
    it('fetches the place entity prefLabel', async() => {
      mockApiRequests();
      const organisationData = await cacher.data(config);

      expect(organisationData[1].countryPrefLabel).toEqual(apiPlaceResponse.prefLabel);
    });
  });

  describe('when the country on the organisation entity is a language code', () => {
    it('fetches the place entity prefLabel', async() => {
      mockApiRequests();
      const organisationData = await cacher.data(config);

      expect(organisationData[0].countryPrefLabel).toEqual({ en: 'Spain' });
    });
  });

  describe('when there is no country on the organisation entity', () => {
    it('does not include a countryPrefLabel', async() => {
      mockApiRequests();
      const organisationData = await cacher.data(config);

      expect(organisationData[2].countryPrefLabel).toEqual(undefined);
    });
  });
});
