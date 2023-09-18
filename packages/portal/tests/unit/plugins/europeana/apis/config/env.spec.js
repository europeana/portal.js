import EuropeanaApiEnvConfig from '@/plugins/europeana/apis/config/env.js';

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

  describe('when scope is public', () => {
    const id = 'record';
    const scope = 'public';

    describe('url', () => {
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

    describe('key', () => {
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
  });

  describe('when scope is private', () => {
    const id = 'record';
    const scope = 'private';

    describe('url', () => {
      it('is set from env var EUROPEANA_${ID}_API_URL_PRIVATE', () => {
        const url = 'http://europeana.local/record';
        process.env.EUROPEANA_RECORD_API_URL_PRIVATE = url;

        const config = new EuropeanaApiEnvConfig(id, scope);

        expect(config.url).toBe(url);
      });

      it('is otherwise undefined', () => {
        const id = 'record';

        const config = new EuropeanaApiEnvConfig(id, scope);

        expect(config.url).toBeUndefined();
      });
    });

    describe('key', () => {
      it('is set to API-specific auth key from env var EUROPEANA_${ID}_API_KEY_PRIVATE', () => {
        const key = 'super-secret-record-api-key';
        process.env.EUROPEANA_RECORD_API_KEY_PRIVATE = key;

        const config = new EuropeanaApiEnvConfig(id, scope);

        expect(config.key).toBe(key);
      });

      it('falls back to shared API auth key from env var EUROPEANA_API_KEY_PRIVATE', () => {
        const key = 'super-secret-api-key';
        process.env.EUROPEANA_API_KEY_PRIVATE = key;

        const config = new EuropeanaApiEnvConfig(id, scope);

        expect(config.key).toBe(key);
      });

      it('is otherwise undefined', () => {
        const id = 'record';

        const config = new EuropeanaApiEnvConfig(id, scope);

        expect(config.key).toBeUndefined();
      });
    });
  });

  describe('toJSON', () => {
    it('includes key, id, scope & url', () => {
      process.env.EUROPEANA_TEST_API_KEY = 'secret';
      process.env.EUROPEANA_TEST_API_URL = 'https://test.example.org/';
      const config = new EuropeanaApiEnvConfig('test', 'public');

      const json = config.toJSON();

      expect(json).toBe('{"key":"secret","id":"test","scope":"public","url":"https://test.example.org/"}');
    });
  });
});
