import nock from 'nock';
import sinon from 'sinon';
import { EuropeanaRecordApi } from '@europeana/apis';
import {
  addMinimalItemPreviewsToSets
} from '@/utils/europeana/set.js';

describe('@utils/europeana/set.js', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    sinon.resetHistory();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('addMinimalItemPreviewsToSets', () => {
    let recordSearchResponse;
    let setSearchResponse;

    beforeEach(() => {
      recordSearchResponse = {
        items: [
          { id: '/123/abc', dcTitleLangAware: { en: ['ABC'] } }
        ]
      };
      setSearchResponse = {
        items: [
          {
            id: 'http://data.europeana.eu/set/1',
            items: [
              'http://data.europeana.eu/item/123/abc',
              'http://data.europeana.eu/item/123/ghi'
            ]
          },
          {
            id: 'http://data.europeana.eu/set/2',
            items: ['http://data.europeana.eu/item/123/def']
          }
        ]
      };

      nock(EuropeanaRecordApi.BASE_URL)
        .get('/search.json')
        .query((query) => query.profile === 'minimal' && query.rows === '2')
        .reply(200, recordSearchResponse);
    });

    it('requests the minimal profile for the first item in each set from the Record API', async() => {
      setSearchResponse.items = await addMinimalItemPreviewsToSets(setSearchResponse.items, new EuropeanaRecordApi);

      expect(nock.isDone()).toBe(true);
    });

    it('stores the found items on the sets', async() => {
      setSearchResponse.items = await addMinimalItemPreviewsToSets(setSearchResponse.items, new EuropeanaRecordApi);

      expect(setSearchResponse.items[0].items[0]).toEqual(recordSearchResponse.items[0]);
    });

    it('stores just the id for first set items not found', async() => {
      setSearchResponse.items = await addMinimalItemPreviewsToSets(setSearchResponse.items, new EuropeanaRecordApi);

      expect(setSearchResponse.items[1].items[0]).toEqual({
        id: '/123/def'
      });
    });

    it('stores just the id for non-first set items', async() => {
      setSearchResponse.items = await addMinimalItemPreviewsToSets(setSearchResponse.items, new EuropeanaRecordApi);

      expect(setSearchResponse.items[0].items[1]).toEqual({
        id: '/123/ghi'
      });
    });
  });
});
