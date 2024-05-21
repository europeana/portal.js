import nock from 'nock';

import EuropeanaApi from '@/base.js';

class EuropeanaTestApi extends EuropeanaApi {
  static ID = 'test';
  static BASE_URL = 'https://default.example.org/';
}

describe('@/base.js', () => {
  describe('EuropeanaApi', () => {
    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterEach(nock.cleanAll);

    afterAll(() => {
      nock.enableNetConnect();
    });

    describe('baseURL', () => {
      let envWas;
      beforeAll(() => {
        envWas = { ...process.env };
      });
      afterEach(() => {
        for (const key in process.env) {
          if (key.startsWith('EUROPEANA_')) {
            delete process.env[key];
          }
        }
      });
      afterAll(() => {
        process.env = { ...envWas };
      });

      const urls = {
        default: EuropeanaTestApi.BASE_URL,
        env: 'https://env.example.org/',
        arg: 'https://arg.example.org/'
      };

      it('first uses url from config arg', () => {
        process.env.EUROPEANA_TEST_API_URL = urls.env;
        const api = new EuropeanaTestApi({ url: urls.arg });

        const url = api.baseURL;

        expect(url).toBe(urls.arg);
      });

      it('second uses url from env', () => {
        process.env.EUROPEANA_TEST_API_URL = urls.env;
        const api = new EuropeanaTestApi();

        const url = api.baseURL;

        expect(url).toBe(urls.env);
      });

      it('third uses default url from class', () => {
        const api = new EuropeanaTestApi();

        const url = api.baseURL;

        expect(url).toBe(urls.default);
      });
    });

    describe('request', () => {
      it('makes the http request with supplied config', async() => {
        nock(EuropeanaTestApi.BASE_URL)
          .get('/search')
          .query((query) => query.page === '1')
          .reply(200);

        const api = new EuropeanaTestApi;
        await api.request({
          method: 'get',
          url: '/search',
          params: { page: '1' }
        });

        expect(nock.isDone()).toBe(true);
      });

      describe('when it errors', () => {
        it('throws an error', async() => {
          const errorMessage = 'Invalid syntax';
          nock(EuropeanaTestApi.BASE_URL)
            .get('/')
            .reply(400, {
              error: errorMessage
            });

          let error;
          try {
            const api = new EuropeanaTestApi;
            await api.request({
              method: 'get',
              url: '/'
            });
          } catch (e) {
            error = e;
          }

          expect(error.message).toBe(errorMessage);
          expect(error.statusCode).toBe(400);
        });
      });
    });
  });
});
