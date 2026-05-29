import axios from 'axios';

let backends;

if (process.server) {
  backends = {
    collections: {
      import: () => import('@/server-middleware/api/collections/index.js'),
      fn: 'fetchData',
      args: (args = [], context = {}) => [...args, context.$config?.redis]
    },
    cache: {
      import: () => import('@/server-middleware/api/cache/index.js'),
      fn: 'cached',
      args: (args = [], context = {}) => [...args, context.$config?.redis]
    }
  };
} else {
  backends = {
    collections: {
      method: 'get',
      url: (args) => `/_api/collections/${args[0]}`,
      params: (args) => args[1]
    },
    cache: {
      method: 'get',
      url: '/_api/cache',
      params: (args) => ({ id: args[0] })
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
      params: backend.params(args)
    })
      .then((response) => response.data);
  }
};
