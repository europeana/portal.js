import * as plugin from '@/plugins/apis';

import sinon from 'sinon';

const inject = sinon.spy();

describe('plugins/apis', () => {
  let envWas;
  beforeAll(() => {
    envWas = { ...process.env };
  });
  afterEach(() => {
    process.env = { ...envWas };
  });

  describe('nuxtRuntimeConfig', () => {
    describe('when scope is public', () => {
      const scope = 'public';

      it('reads overriden URL from env var EUROPEANA_${ID}_API_URL', () => {
        const id = 'record';
        const url = 'https://europeana.example.org/record';
        process.env.EUROPEANA_RECORD_API_URL = url;

        const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

        expect(nuxtRuntimeConfig[id].url).toBe(url);
      });

      it('falls back to default URL', () => {
        const id = 'record';
        const url = 'https://api.europeana.eu/record';

        const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

        expect(nuxtRuntimeConfig[id].url).toBe(url);
      });

      describe('when API is authenticated', () => {
        const id = 'record';

        it('reads API-specific auth key from env var EUROPEANA_${ID}_API_KEY', () => {
          const key = 'super-secret-record-api-key';
          process.env.EUROPEANA_RECORD_API_KEY = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBe(key);
        });

        it('falls back to shared API auth key from env var EUROPEANA_API_KEY', () => {
          const key = 'super-secret-api-key';
          process.env.EUROPEANA_API_KEY = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBe(key);
        });
      });

      describe('when API is not authenticated', () => {
        const id = 'iiifPresentation';

        it('ignores API-specific auth key from env var EUROPEANA_${ID}_API_KEY', () => {
          const key = 'super-secret-iiif-presentation-api-key';
          process.env.EUROPEANA_IIIF_PRESENTATION_API_KEY = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBeUndefined();
        });

        it('ignores shared API auth key from env var EUROPEANA_API_KEY', () => {
          const key = 'super-secret-api-key';
          process.env.EUROPEANA_API_KEY = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBeUndefined();
        });
      });
    });

    describe('when scope is private', () => {
      const scope = 'private';

      it('reads overriden URL from env var EUROPEANA_${ID}_API_URL_PRIVATE', () => {
        const id = 'record';
        const url = 'http://europeana.local/record';
        process.env.EUROPEANA_RECORD_API_URL_PRIVATE = url;

        const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

        expect(nuxtRuntimeConfig[id].url).toBe(url);
      });

      it('does not fall back to default URL', () => {
        const id = 'record';

        const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

        expect(nuxtRuntimeConfig[id].url).toBeUndefined();
      });

      describe('when API is authenticated', () => {
        const id = 'record';

        it('reads API-specific auth key from env var EUROPEANA_${ID}_API_KEY_PRIVATE', () => {
          const key = 'super-secret-record-api-key';
          process.env.EUROPEANA_RECORD_API_KEY_PRIVATE = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBe(key);
        });

        it('falls back to shared API auth key from env var EUROPEANA_API_KEY_PRIVATE', () => {
          const key = 'super-secret-api-key';
          process.env.EUROPEANA_API_KEY_PRIVATE = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBe(key);
        });
      });

      describe('when API is not authenticated', () => {
        const id = 'iiifPresentation';

        it('ignores API-specific auth key from env var EUROPEANA_${ID}_API_KEY_PRIVATE', () => {
          const key = 'super-secret-iiif-presentation-api-key';
          process.env.EUROPEANA_IIIF_PRESENTATION_API_KEY_PRIVATE = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBeUndefined();
        });

        it('ignores shared API auth key from env var EUROPEANA_API_KEY_PRIVATE', () => {
          const key = 'super-secret-api-key';
          process.env.EUROPEANA_API_KEY_PRIVATE = key;

          const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig({ scope });

          expect(nuxtRuntimeConfig[id].key).toBeUndefined();
        });
      });
    });
  });

  describe('publicPrivateRewriteOrigins', () => {
    describe('when private runtime config has an API URL', () => {
      it('maps it to the public API URL', () => {
        const publicUrl = 'https://example.org/annotation';
        const privateUrl = 'http://europeana.local/annotation';
        process.env.EUROPEANA_ANNOTATION_API_URL = publicUrl;
        process.env.EUROPEANA_ANNOTATION_API_URL_PRIVATE = privateUrl;

        const publicPrivateRewriteOrigins = plugin.publicPrivateRewriteOrigins();

        expect(publicPrivateRewriteOrigins[0]).toEqual({
          from: privateUrl,
          to: publicUrl
        });
      });
    });

    describe('when private runtime config has no API URL', () => {
      it('is omitted from the map', () => {
        const publicUrl = 'https://example.org/annotation';
        process.env.EUROPEANA_ANNOTATION_API_URL = publicUrl;

        const publicPrivateRewriteOrigins = plugin.publicPrivateRewriteOrigins();

        expect(publicPrivateRewriteOrigins.length).toBe(0);
      });
    });
  });

  describe('store module', () => {
    let storeModule;

    beforeAll(async() => {
      await plugin.default({
        app: {},
        store: {
          registerModule: sinon.spy((name, module) => {
            storeModule = module;
          })
        }
      }, inject);
    });

    describe('mutations', () => {
      describe('init', () => {
        it('sets URLs for APIs from request headers', () => {
          const headers = {
            'x-europeana-annotation-api-url': 'https://annotation.example.org',
            'x-europeana-entity-api-url': 'https://entity.example.org',
            'x-europeana-record-api-url': 'https://record.example.org'
          };
          const state = storeModule.state();

          storeModule.mutations.init(state, { $config: { europeana: { apis: {} } }, req: { headers } });

          expect(state.urls.annotation).toEqual('https://annotation.example.org');
          expect(state.urls.entity).toEqual('https://entity.example.org');
          expect(state.urls.record).toEqual('https://record.example.org');
        });
      });
    });
  });
});
