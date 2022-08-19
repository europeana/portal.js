import * as cacher from '@/cachers/collections/organisations.js';
import * as baseCacher from '@/cachers/collections/index.js';
import sinon from 'sinon';
import nock from 'nock';

const organisations = {
  0: { id: 'http://data.europeana.eu/organization/001', type: 'Organization', prefLabel: { en: 'Museum', es: 'Museo' } },
  1: { id: 'http://data.europeana.eu/organization/002', type: 'Organization', prefLabel: { en: 'Gallery' } }
};

const fields = [
  { label: 'http://data.europeana.eu/organization/001', count: 100 },
  { label: 'http://data.europeana.eu/organization/002', count: 200 },
  { label: 'http://data.europeana.eu/organization/003', count: 150 }
];

const apiResponse = {
  facets: [{
    name: 'foaf_organization',
    fields
  }]
};

const config = {
  europeana: {
    apis: {
      record: {
        url: 'https://api.example.org/record',
        key: 'recordApiKey'
      }
    }
  }
};

describe('@/cachers/collections/organisations', () => {
  beforeEach(() => {
    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.profile === 'facets' &&
        query.query === 'foaf_organization:*data.europeana.eu*' &&
        query.facet === 'foaf_organization' &&
        query['f.foaf_organization.facet.limit'] === '10000' &&
        query.rows === '0'
      ))
      .reply(200, apiResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetches data with type: organization', async() => {
    sinon.stub(baseCacher, 'default').resolves(organisations);

    await cacher.data(config);

    expect(nock.isDone()).toBe(true);
    expect(baseCacher.default.calledWith({ type: 'organization' }, config)).toBe(true);
    sinon.resetHistory();
  });

  it('picks slug, record count, native label and non-native English label', () => {
    expect(cacher.PICK).toEqual(['slug', 'recordCount', 'nativeLabel', 'nonNativeEnglishLabel']);
  });

  it('localises nothing', () => {
    expect(cacher.LOCALISE).toBeUndefined();
  });

  it('internationalises by native label and non-native English label', () => {
    const data = [
      { type: 'Organization', prefLabel: { en: 'Museum', es: 'Museo' } },
      { type: 'Organization', prefLabel: { en: 'Gallery' } }
    ];

    const expected =       [
      {
        type: 'Organization',
        prefLabel: { en: 'Museum', es: 'Museo' },
        nativeLabel: { values: ['Museo'], code: 'es', translationSource: undefined },
        nonNativeEnglishLabel: { values: ['Museum'], code: 'en', translationSource: undefined }
      },
      {
        type: 'Organization',
        prefLabel: { en: 'Gallery' },
        nativeLabel: { values: ['Gallery'], code: 'en', translationSource: undefined },
        nonNativeEnglishLabel: { values: [] }
      }
    ];

    expect(cacher.INTERNATIONALISE(data)).toEqual(expected);
  });
});
