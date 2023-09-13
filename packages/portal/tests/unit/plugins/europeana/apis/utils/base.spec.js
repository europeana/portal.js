import EuropeanaApi from '@/plugins/europeana/apis/utils/base.js';
import EuropeanaApiEnvConfig from '@/plugins/europeana/apis/config/env.js';

describe('EuropeanaApi', () => {
  describe('baseURL', () => {
    let envWas;
    beforeAll(() => {
      envWas = { ...process.env };
    });
    afterEach(() => {
      delete process.client;
      delete process.server;
      for (const key in process.env) {
        if (key.startsWith('EUROPEANA_')) {
          delete process.env[key];
        }
      }
      req = { headers: {} };
    });
    afterAll(() => {
      process.env = { ...envWas };
    });

    let req = { headers: {} };
    let scope;

    class EuropeanaTestApi extends EuropeanaApi {
      static ID = 'test';
      static BASE_URL = 'https://default.example.org/';
    }

    const urls = {
      default: EuropeanaTestApi.BASE_URL,
      envPrivate: 'https://envPrivate.example.org/',
      envPublic: 'https://envPublic.example.org/',
      httpHeader: 'https://httpHeader.example.org/'
    };

    const envPrivateStates = {
      set: () => process.env.EUROPEANA_TEST_API_URL_PRIVATE = urls.envPrivate,
      unset: () => {}
    };

    const envPublicStates = {
      set: () => process.env.EUROPEANA_TEST_API_URL = urls.envPublic,
      unset: () => {}
    };

    const httpHeaderStates = {
      set: () => req.headers['x-europeana-test-api-url'] = urls.httpHeader,
      unset: () => {}
    };

    const requestTypes = {
      'client-side': () => scope = 'public',
      'server-side': () => scope = 'private'
    };

    const scenarios = [
      { envPublic: 'unset', envPrivate: 'unset', httpHeader: 'unset', requestType: 'server-side', url: 'default' },
      { envPublic: 'unset', envPrivate: 'unset', httpHeader: 'unset', requestType: 'client-side', url: 'default' },
      { envPublic: 'unset', envPrivate: 'unset', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { envPublic: 'unset', envPrivate: 'unset', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' },
      { envPublic: 'unset', envPrivate: 'set', httpHeader: 'unset', requestType: 'server-side', url: 'envPrivate' },
      { envPublic: 'unset', envPrivate: 'set', httpHeader: 'unset', requestType: 'client-side', url: 'default' },
      { envPublic: 'unset', envPrivate: 'set', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { envPublic: 'unset', envPrivate: 'set', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' },
      { envPublic: 'set', envPrivate: 'unset', httpHeader: 'unset', requestType: 'server-side', url: 'envPublic' },
      { envPublic: 'set', envPrivate: 'unset', httpHeader: 'unset', requestType: 'client-side', url: 'envPublic' },
      { envPublic: 'set', envPrivate: 'unset', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { envPublic: 'set', envPrivate: 'unset', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' },
      { envPublic: 'set', envPrivate: 'set', httpHeader: 'unset', requestType: 'server-side', url: 'envPrivate' },
      { envPublic: 'set', envPrivate: 'set', httpHeader: 'unset', requestType: 'client-side', url: 'envPublic' },
      { envPublic: 'set', envPrivate: 'set', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { envPublic: 'set', envPrivate: 'set', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' }
    ];

    for (const envPublicState in envPublicStates) {
      describe(`and public env var URL is ${envPublicState}`, () => {
        for (const envPrivateState in envPrivateStates) {
          describe(`private env var URL is ${envPrivateState}`, () => {
            for (const httpHeaderState in httpHeaderStates) {
              describe(`and custom HTTP header URL is ${httpHeaderState}`, () => {
                for (const requestType in requestTypes) {
                  describe(`and request type is ${requestType}`, () => {
                    const scenario = scenarios.find((s) => {
                      return (s.envPrivate === envPrivateState) &&
                        (s.envPublic === envPublicState) &&
                        (s.httpHeader === httpHeaderState) &&
                        (s.requestType === requestType);
                    });

                    it(`uses ${scenario?.url} URL source`, () => {
                      envPrivateStates[envPrivateState]();
                      envPublicStates[envPublicState]();
                      httpHeaderStates[httpHeaderState]();
                      requestTypes[requestType]();

                      const envConfig = new EuropeanaApiEnvConfig('test', scope);
                      const context = {
                        $config: {
                          europeana: {
                            apis: {
                              test: envConfig
                            }
                          }
                        },
                        req
                      };
                      const api = new EuropeanaTestApi(context);

                      expect(api.baseURL).toBe(urls[scenario.url]);
                    });
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  describe('createAxios', () => {
    it('uses app.$axiosLogger from context as request interceptor', () => {
      const $axiosLogger = (requestConfig) => requestConfig;
      const context = {
        app: { $axiosLogger }
      };
      const axiosInstance = (new EuropeanaApi(context)).createAxios({}, context);

      expect(axiosInstance.interceptors.request.handlers.some((handler) => {
        return handler.fulfilled === $axiosLogger;
      })).toBe(true);
    });
  });
});
