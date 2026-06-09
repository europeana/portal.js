import axios from 'axios';
import qs from 'qs';

const backends = () => {
  if (process.server) {
    return {
      cache: {
        import: () => import('@/server-middleware/api/cache/index.js'),
        fn: 'cached',
        args: (args = [], context = {}) => [...args, context.$config?.redis]
      },
      collections: {
        import: () => import('@/server-middleware/api/collections/index.js'),
        fn: 'fetchData',
        args: (args = [], context = {}) => [...args, context.$config?.redis]
      },
      'collections/retrieve': {
        import: () => import('@/server-middleware/api/collections/retrieve.js'),
        fn: 'fetchData',
        args: (args = [], context = {}) => [...args, context]
      }
    };
  } else {
    return {
      cache: {
        method: 'get',
        url: '/_api/cache',
        params: (args) => ({ id: args[0] })
      },
      collections: {
        method: 'get',
        url: (args) => `/_api/collections/${args[0]}`,
        params: (args) => args[1]
      },
      'collections/retrieve': {
        method: 'post',
        url: '/_api/collections/retrieve',
        params: (args) => args[1],
        data: (args) => args[0]
      }
    };
  }
};

export const backendFetch = (id, args, context = {}) => {
  const backend = backends()[id];

  if (process.server) {
    return backend.import()
      .then((module) => module[backend.fn].apply(null, typeof backend.args === 'function' ? backend.args(args, context) : args));
  } else  {
    return axios.request({
      baseURL: context.$config.app.baseUrl,
      method: backend.method,
      url: typeof backend.url === 'function' ? backend.url(args) : backend.url,
      data: typeof backend.data === 'function' ? backend.data(args) : backend.data,
      params: backend.params(args),
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      }
    })
      .then((response) => response.data);
  }
};
