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
});
