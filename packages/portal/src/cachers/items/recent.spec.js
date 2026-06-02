import nock from 'nock';
import sinon from 'sinon';

const cacher = require('@/cachers/items/recent');

const apiResponses = {
  datasets: [
    { items: [{ edmDatasetName: 'dataset1' }] },
    { items: [{ edmDatasetName: 'dataset2' }] },
    { items: [{ edmDatasetName: 'dataset3' }] },
    { items: [{ edmDatasetName: 'dataset4' }] }
  ],
  items: [
    { items: [{ id: 'item1' }] },
    { items: [{ id: 'item2' }] },
    { items: [{ id: 'item3' }] },
    { items: [{ id: 'item4' }] }
  ]
};

const dataToCache = [
  { id: 'item1' },
  { id: 'item2' },
  { id: 'item3' },
  { id: 'item4' }
];

const searchStub = sinon.stub();
searchStub.withArgs(sinon.match.has('query', '*:*')).resolves(apiResponses.datasets[0]);
searchStub.withArgs(sinon.match.has('query', 'NOT edm_datasetName:("dataset1")')).resolves(apiResponses.datasets[1]);
searchStub.withArgs(sinon.match.has('query', 'NOT edm_datasetName:("dataset1" OR "dataset2")')).resolves(apiResponses.datasets[2]);
searchStub.withArgs(sinon.match.has('query', 'NOT edm_datasetName:("dataset1" OR "dataset2" OR "dataset3")')).resolves(apiResponses.datasets[3]);
searchStub.withArgs(sinon.match.has('query', 'edm_datasetName:"dataset1"')).resolves(apiResponses.items[0]);
searchStub.withArgs(sinon.match.has('query', 'edm_datasetName:"dataset2"')).resolves(apiResponses.items[1]);
searchStub.withArgs(sinon.match.has('query', 'edm_datasetName:"dataset3"')).resolves(apiResponses.items[2]);
searchStub.withArgs(sinon.match.has('query', 'edm_datasetName:"dataset4"')).resolves(apiResponses.items[3]);
const context = {
  $apis: {
    record: {
      search: searchStub
    }
  }
};

describe('cachers/items/recent', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('.data', () => {
    it('queries Record API for 4 items from recently updated content tier 4 datasets', async() => {
      await cacher.data(context);

      expect(context.$apis.record.search.getCalls().length).toBe(8);
    });

    it('returns item metadata to cache', async() => {
      const data = await cacher.data(context);

      expect(data).toEqual(dataToCache);
    });
  });
});
