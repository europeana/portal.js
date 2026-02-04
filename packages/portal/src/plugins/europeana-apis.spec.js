import sinon from 'sinon';

import * as plugin from '@/plugins/europeana-apis.js';

describe('plugins/europeana-apis', () => {
  afterEach(sinon.resetHistory);

  describe('default export', () => {
    it('registers the store module', () => {
      const context = {
        store: {
          registerModule: sinon.spy()
        }
      };
      const inject = () => {};

      plugin.default(context, inject);

      expect(context.store.registerModule.calledWith('apis', plugin.storeModule)).toBe(true);
    });

    it('injects the plugin', () => {
      const context = {
        store: {
          registerModule: () => {}
        }
      };
      const inject = sinon.spy();

      plugin.default(context, inject);

      expect(inject.calledWith('apis', sinon.match.object)).toBe(true);
    });

    for (const id of plugin.API_IDS) {
      it(`exposes the ${id} API`, () => {
        let $apis;
        const context = {
          store: {
            registerModule: () => {}
          }
        };
        const inject = (name, injected) => $apis = injected;

        plugin.default(context, inject);

        expect(Object.keys($apis).includes(id)).toBe(true);
      });
    }
  });

  describe('store module', () => {
    describe('mutations', () => {
      describe('init', () => {
        it('sets URLs for APIs from request headers', () => {
          let $apis;
          let storeModule;
          const context = {
            store: {
              registerModule: (name, module) => storeModule = module
            }
          };
          const inject = (name, injected) => $apis = injected;
          plugin.default(context, inject);

          const storeState = storeModule.state();
          const headers = {
            'x-europeana-annotation-api-url': 'https://annotation.example.org',
            'x-europeana-entity-management-api-url': 'https://entity-mgmt.example.org',
            'x-europeana-record-api-url': 'https://record.example.org'
          };

          storeModule.mutations.init(storeState, { $apis, req: { headers } });

          expect(storeState.reqHeaderUrls.annotation).toEqual('https://annotation.example.org');
          expect(storeState.reqHeaderUrls.entityManagement).toEqual('https://entity-mgmt.example.org');
          expect(storeState.reqHeaderUrls.record).toEqual('https://record.example.org');
        });
      });
    });
  });

  describe('nuxtRuntimeConfig', () => {
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

    for (const id of plugin.API_IDS) {
      it(`includes env config for ${id} API`, () => {
        const nuxtRuntimeConfig = plugin.nuxtRuntimeConfig();

        expect(Object.keys(nuxtRuntimeConfig).includes(id)).toBe(true);
        expect(nuxtRuntimeConfig[id].constructor.name).toBe('EuropeanaApiEnvConfig');
      });
    }
  });
});
