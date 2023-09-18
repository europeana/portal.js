import * as plugin from '@/plugins/europeana/apis/config/nuxt.js';
import * as apisPlugin from '@/plugins/europeana/apis/index.js';

describe('@/plugins/europeana/apis/config/nuxt', () => {
  let envWas;
  beforeAll(() => {
    envWas = { ...process.env };
  });
  afterEach(() => {
    plugin.resetRuntimeConfig({ scope: 'public' });
    plugin.resetRuntimeConfig({ scope: 'private' });
    for (const key in process.env) {
      if (key.startsWith('EUROPEANA_')) {
        delete process.env[key];
      }
    }
  });
  afterAll(() => {
    process.env = { ...envWas };
  });

  describe('nuxtRuntimeConfig', () => {
    for (const id of apisPlugin.API_IDS) {
      it(`includes env config for ${id} API`, () => {
        const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig();

        expect(Object.keys(nuxtRuntimeConfig).includes(id)).toBe(true);
        expect(nuxtRuntimeConfig[id].constructor.name).toBe('EuropeanaApiEnvConfig');
      });
    }
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
});
