import * as cacher from './institutions.js';
import * as baseCacher from '../index.js';
import sinon from 'sinon';
import nock from 'nock';

const slug = '001-museum';
const searchResponse = [
  { id: 'http://data.europeana.eu/organization/001', slug, country: { id: 'http://data.europeana.eu/place/100' } },
  { id: 'http://data.europeana.eu/organization/002' }
];

const context = {};

describe('@/cachers/collections/institutions', () => {
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

  it('picks specific fields', () => {
    expect(cacher.PICK).toEqual(['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'countryPrefLabel', 'aggregatedVia']);
  });

  it('localises countryPrefLabel', () => {
    expect(cacher.LOCALISE).toEqual('countryPrefLabel');
  });
});
