import EuropeanaApi from '@/plugins/europeana/apis/base.js';
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
      env: 'https://env.example.org/',
      httpHeader: 'https://httpHeader.example.org/'
    };

    const envStates = {
      set: () => process.env.EUROPEANA_TEST_API_URL = urls.env,
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
      { env: 'unset', httpHeader: 'unset', requestType: 'server-side', url: 'default' },
      { env: 'unset', httpHeader: 'unset', requestType: 'client-side', url: 'default' },
      { env: 'unset', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { env: 'unset', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' },
      { env: 'unset', httpHeader: 'unset', requestType: 'client-side', url: 'default' },
      { env: 'unset', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { env: 'unset', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' },
      { env: 'set', httpHeader: 'unset', requestType: 'server-side', url: 'env' },
      { env: 'set', httpHeader: 'unset', requestType: 'client-side', url: 'env' },
      { env: 'set', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { env: 'set', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' },
      { env: 'set', httpHeader: 'unset', requestType: 'client-side', url: 'env' },
      { env: 'set', httpHeader: 'set', requestType: 'server-side', url: 'httpHeader' },
      { env: 'set', httpHeader: 'set', requestType: 'client-side', url: 'httpHeader' }
    ];

    for (const envState in envStates) {
      describe(`and public env var URL is ${envState}`, () => {
        for (const httpHeaderState in httpHeaderStates) {
          describe(`and custom HTTP header URL is ${httpHeaderState}`, () => {
            for (const requestType in requestTypes) {
              describe(`and request type is ${requestType}`, () => {
                const scenario = scenarios.find((s) => {
                  return (s.env === envState) &&
                    (s.httpHeader === httpHeaderState) &&
                    (s.requestType === requestType);
                });

                it(`uses ${scenario?.url} URL source`, () => {
                  envStates[envState]();
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
