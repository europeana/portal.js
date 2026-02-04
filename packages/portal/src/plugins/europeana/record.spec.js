import nock from 'nock';
import md5 from 'md5';
import EuropeanaRecordApi, { isEuropeanaRecordId, recordIdFromUrl } from '@/plugins/europeana/record';

const europeanaId = '/123/abc';
const apiEndpoint = `${europeanaId}.json`;

const apiResponse = {
  success: true,
  object: {
    about: europeanaId
  }
};

describe('plugins/europeana/record', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('EuropeanaRecordApi', () => {
    it('is authenticating', () => {
      expect(EuropeanaRecordApi.AUTHENTICATING).toBe(true);
    });

    it('is authorising', () => {
      expect(EuropeanaRecordApi.AUTHORISING).toBe(true);
    });
  });

  describe('EuropeanaRecordApi().get()', () => {
    it('makes an API request', async() => {
      nock(EuropeanaRecordApi.BASE_URL)
        .get(apiEndpoint)
        .query(true)
        .reply(200, apiResponse);

      await (new EuropeanaRecordApi).get(europeanaId);

      expect(nock.isDone()).toBe(true);
    });

    it('returns data from API', async() => {
      nock(EuropeanaRecordApi.BASE_URL)
        .get(apiEndpoint)
        .query(true)
        .reply(200, apiResponse);

      const response = await (new EuropeanaRecordApi).get(europeanaId);

      expect(response).toEqual(apiResponse);
    });
  });

  describe('EuropeanaRecordApi().find()', () => {
    it('searches the Record API for specified item IDs', async() => {
      const ids = ['/123/abc', '/123/def'];
      nock(EuropeanaRecordApi.BASE_URL)
        .get('/search.json')
        .query(query => {
          return query.profile === 'minimal' &&
            !query.qf &&
            query.query === 'europeana_id:("/123/abc" OR "/123/def")';
        })
        .reply(200);

      await (new EuropeanaRecordApi).find(ids, { profile: 'minimal' });

      expect(nock.isDone()).toBe(true);
    });

    it('searches the Record API for specified item URIs', async() => {
      const uris = ['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/123/def'];
      nock(EuropeanaRecordApi.BASE_URL)
        .get('/search.json')
        .query(query => {
          return !query.profile &&
            !query.qf &&
            query.query === 'europeana_id:("/123/abc" OR "/123/def")';
        })
        .reply(200);

      await (new EuropeanaRecordApi).find(uris);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('EuropeanaRecordApi().mediaProxyUrl()', () => {
    const europeanaId = '/123/abc';
    const mediaUrl = 'https://www.example.org/audio.ogg';

    it('uses origin https://proxy.europeana.eu', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId));

      expect(proxyUrl.origin).toBe('https://proxy.europeana.eu');
    });

    it('uses europeanaId & web resource hash as path', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId));

      expect(proxyUrl.pathname).toBe(`/media${europeanaId}/${md5(mediaUrl)}`);
    });

    it('sets recordApiUrl query param', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId));

      expect(proxyUrl.searchParams.get('recordApiUrl')).toBe('https://api.europeana.eu/record');
    });

    it('sets additional params from final arg', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId, { disposition: 'inline' }));

      expect(proxyUrl.searchParams.get('disposition')).toBe('inline');
    });
  });

  describe('isEuropeanaRecordId()', () => {
    describe('with valid record ID', () => {
      it('returns `true`', () => {
        const recordId = '/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        expect(validation).toBe(true);
      });
    });

    describe('with invalid record ID', () => {
      it('returns `false`', () => {
        const recordId = 'http://www.example.org/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        expect(validation).toBe(false);
      });
    });
  });

  describe('recordIdFromUrl()', () => {
    const supportedFormats = [
      '/90402/SK_A_2344',
      'http://data.europeana.eu/item/90402/SK_A_2344',
      'https://www.europeana.eu/en/item/90402/SK_A_2344'
    ];

    for (const format of supportedFormats) {
      it(`is able to parse an identifer from ${format}`, () => {
        const result = recordIdFromUrl(format);
        expect(result).toBe('/90402/SK_A_2344');
      });
    }

    it('returns undefined when the format is not supported', () => {
      const result = recordIdFromUrl('Unsupported format');
      expect(result).toBe(undefined);
    });
  });
});
