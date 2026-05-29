import axios from 'axios';
import qs from 'qs';

let backends;

if (process.server) {
  backends = {
    cache: {
      import: () => import('@/server-middleware/api/cache/index.js'),
      fn: 'cached',
      args: (args = [], context = {}) => [...args, context.$config?.redis]
    },
    collections: {
      import: () => import('@/server-middleware/api/collections/index.js'),
      fn: 'fetchData',
      args: (args = [], context = {}) => [...args, context.$config?.redis]
    }
  };
} else {
  backends = {
    cache: {
      method: 'get',
      url: '/_api/cache',
      params: (args) => ({ id: args[0] })
    },
    collections: {
      method: 'get',
      url: (args) => `/_api/collections/${args[0]}`,
      params: (args) => args[1]
    }
  };
}

export const backendFetch = (id, args, context = {}) => {
  const backend = backends[id];

  if (process.server) {
    return backend.import()
      .then((module) => module[backend.fn].apply(null, backend.args(args, context)));
  } else  {
    return axios.request({
      baseURL: context.$config.app.baseUrl,
      method: backend.method,
      url: typeof backend.url === 'function' ? backend.url(args) : backend.url,
      params: backend.params(args),
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      }
    })
      .then((response) => response.data);
  }
};
