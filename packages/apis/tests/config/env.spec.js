import EuropeanaApiEnvConfig from '@/config/env.js';

const scopes = ['public', 'private'];
const id = 'record';

describe('@/config/env.js', () => {
  describe('EuropeanaApiEnvConfig', () => {
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

    describe('url', () => {
      for (const scope of scopes) {
        describe(`when scope is ${scope}`, () => {
          it('is set from env var EUROPEANA_${ID}_API_URL', () => {
            const url = 'https://europeana.example.org/record';
            process.env.EUROPEANA_RECORD_API_URL = url;

            const config = new EuropeanaApiEnvConfig(id, scope);

            expect(config.url).toBe(url);
          });

          it('is otherwise undefined', () => {
            const id = 'record';

            const config = new EuropeanaApiEnvConfig(id, scope);

            expect(config.url).toBeUndefined();
          });
        });
      }
    });

    describe('urlRewrite', () => {
      describe('when scope is private', () => {
        const scope = 'private';
        it('is set from env var EUROPEANA_${ID}_API_URL_PRIVATE', () => {
          const url = 'https://europeana.example.org/record';
          process.env.EUROPEANA_RECORD_API_URL_PRIVATE = url;

          const config = new EuropeanaApiEnvConfig(id, scope);

          expect(config.urlRewrite).toBe(url);
        });
      });

      describe('when scope is public', () => {
        const scope = 'public';
        it('is not set from env var EUROPEANA_${ID}_API_URL_PRIVATE', () => {
          const url = 'https://europeana.example.org/record';
          process.env.EUROPEANA_RECORD_API_URL_PRIVATE = url;

          const config = new EuropeanaApiEnvConfig(id, scope);

          expect(config.urlRewrite).toBeUndefined();
        });
      });
    });

    describe('key', () => {
      for (const scope of scopes) {
        describe(`when scope is ${scope}`, () => {
          it('is set to API-specific auth key from env var EUROPEANA_${ID}_API_KEY', () => {
            const key = 'super-secret-record-api-key';
            process.env.EUROPEANA_RECORD_API_KEY = key;

            const config = new EuropeanaApiEnvConfig(id, scope);

            expect(config.key).toBe(key);
          });

          it('falls back to shared API auth key from env var EUROPEANA_API_KEY', () => {
            const key = 'super-secret-api-key';
            process.env.EUROPEANA_API_KEY = key;

            const config = new EuropeanaApiEnvConfig(id, scope);

            expect(config.key).toBe(key);
          });

          it('is otherwise undefined', () => {
            const id = 'record';

            const config = new EuropeanaApiEnvConfig(id, scope);

            expect(config.key).toBeUndefined();
          });
        });
      }
    });

    describe('toJSON', () => {
      it('includes key, id, scope & url', () => {
        process.env.EUROPEANA_TEST_API_KEY = 'secret';
        process.env.EUROPEANA_TEST_API_URL = 'https://test.example.org/';
        process.env.EUROPEANA_TEST_API_URL_PRIVATE = 'https://priv.example.org/';
        const config = new EuropeanaApiEnvConfig('test', 'private');

        const json = config.toJSON();

        expect(json).toBe('{"key":"secret","id":"test","scope":"private","url":"https://test.example.org/","urlRewrite":"https://priv.example.org/"}');
      });
    });
  });
});
