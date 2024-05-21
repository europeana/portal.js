import sinon from 'sinon';

import * as plugin from '@/plugins/europeana-apis.js';

const API_IDS = [
  'annotation',
  'data',
  'entity',
  'entityManagement',
  'fulltext',
  'iiifPresentation',
  'mediaProxy',
  'recommendation',
  'record',
  'set',
  'thumbnail'
];

const injectSpy = sinon.spy();
const storeRegisterModuleSpy = sinon.spy();

const registerPlugin = ({ context = {}, inject = injectSpy } = {}) => {
  return plugin.default({
    app: {},
    store: {
      registerModule: storeRegisterModuleSpy
    },
    ...context
  }, inject);
};

describe('plugins/europeana-apis', () => {
  afterEach(sinon.resetHistory);

  describe('default export', () => {
    it('registers the store module', () => {
      registerPlugin();

      expect(storeRegisterModuleSpy.calledWith('apis', plugin.storeModule)).toBe(true);
    });

    it('injects the plugin', () => {
      registerPlugin();

      expect(injectSpy.calledWith('apis', sinon.match.object)).toBe(true);
    });

    for (const id of API_IDS) {
      it(`exposes the ${id} API`, () => {
        let $apis;
        const inject = (name, injected) => $apis = injected;

        registerPlugin({ inject });

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
          registerPlugin({ context, inject });

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
});

// formerly on @europeana/apis/src/base; rewrite
// describe('createAxios', () => {
//   it('uses app.$axiosLogger from context as request interceptor', () => {
//     const $axiosLogger = (requestConfig) => requestConfig;
//     const context = {
//       app: { $axiosLogger }
//     };
//     const axiosInstance = (new EuropeanaApi(context)).createAxios({}, context);
//
//     expect(axiosInstance.interceptors.request.handlers.some((handler) => {
//       return handler.fulfilled === $axiosLogger;
//     })).toBe(true);
//   });
// });
//
// describe('rewriteAxiosRequestUrl', () => {
//   it('favours urlRewrite from config for request baseURL', () => {
//     const urlRewrite = 'http://rewrite.internal/';
//     const requestConfig = {};
//     const api = new EuropeanaApi;
//     api.config = { urlRewrite };
//
//     api.rewriteAxiosRequestUrl(requestConfig);
//
//     expect(requestConfig.baseURL).toEqual(urlRewrite);
//   });
// });
