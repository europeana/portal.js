import * as cacher from './geo.js';
import * as baseCacher from '../index.js';
import sinon from 'sinon';
import nock from 'nock';

const searchResponse = [
  { id: 'http://data.europeana.eu/organization/001', hasAddress: { hasGeo: 'geo:56.950364,24.1042986' } },
  { id: 'http://data.europeana.eu/organization/002' }
];

const context = {};

describe('@/cachers/collections/geo', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  sinon.stub(baseCacher, 'default')
    .resolves(searchResponse);

  it('fetches data with qf: "type:Organization"', async() => {
    await cacher.data(context);

    expect(baseCacher.default.calledWith({ qf: 'type:Organization' }, context)).toBe(true);
  });

  it('modifies geo data', async() => {
    const data = await cacher.data(context);

    expect(data.features[0]).toEqual({
      'type': 'Feature',
      'id': 'http://data.europeana.eu/organization/001',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          24.1042986,
          56.950364
        ]
      }
    });
  });
});
