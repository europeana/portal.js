import plugin from '@/modules/axios-logger/templates/plugin';
import sinon from 'sinon';

let requestInterceptor;

const factory = (context = {}) => {
  const mocks = {
    inject(name, injection) {
      requestInterceptor = injection;
    }
  };
  sinon.spy(mocks, 'inject');

  plugin(context, mocks.inject);
  mocks.requestInterceptor = requestInterceptor;

  return mocks;
};

describe('modules/axios-logger/templates/plugin', () => {
  beforeEach(sinon.resetHistory);

  it('injects request interceptor', () => {
    const wrapper = factory();

    expect(wrapper.inject.called).toBe(true);
    expect(typeof wrapper.requestInterceptor).toBe('function');
  });

  describe('request interceptor', () => {
    const context = {
      store: {
        commit: sinon.spy(),
        registerModule: () => sinon.spy()
      }
    };

    it('logs the request method and URL to the store', () => {
      const requestConfig = {
        method: 'get',
        url: 'https://api.example.org/search.json',
        params: {
          query: '*'
        }
      };

      const wrapper = factory(context);
      wrapper.requestInterceptor(requestConfig);

      expect(context.store.commit.calledWith('axiosLogger/push', {
        method: 'GET',
        url: 'https://api.example.org/search.json?query=*'
      })).toBe(true);
    });

    it('includes baseURL if url is not absolute', () => {
      const requestConfig = {
        method: 'head',
        url: '/search.json',
        baseURL: 'https://api.example.org'
      };

      const wrapper = factory(context);
      wrapper.requestInterceptor(requestConfig);

      expect(context.store.commit.calledWith('axiosLogger/push', {
        method: 'HEAD',
        url: 'https://api.example.org/search.json'
      })).toBe(true);
    });

    it('ignores requests for methods excluded by config', () => {
      const configuredContext = {
        ...context,
        $config: {
          axiosLogger: {
            httpMethods: ['GET']
          }
        }
      };
      const requestConfig = {
        method: 'put',
        url: 'https://api.example.org/'
      };

      const wrapper = factory(configuredContext);
      wrapper.requestInterceptor(requestConfig);

      expect(context.store.commit.called).toBe(false);
    });

    it('removes values for query parameters specified by config', () => {
      const configuredContext = {
        ...context,
        $config: {
          axiosLogger: {
            clearParams: ['apiKey']
          }
        }
      };
      const requestConfig = {
        method: 'get',
        url: 'https://api.example.org/search.json',
        params: {
          query: '*',
          apiKey: 'SECRET'
        }
      };

      const wrapper = factory(configuredContext);
      wrapper.requestInterceptor(requestConfig);

      expect(context.store.commit.calledWith('axiosLogger/push', {
        method: 'GET',
        url: 'https://api.example.org/search.json?query=*&apiKey='
      })).toBe(true);
    });
  });
});
