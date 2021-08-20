import axios from 'axios';
import md5 from 'md5';

import { createRedisClient } from '../../cachers/utils.js';

// import { performance } from 'perf_hooks';

import queries from './queries/index.js';

let $axios;
let $redis;

// TODO: do not cache error responses from CTF

export default ({ app, $config }, inject) => {
  if (!$axios) {
    const origin = 'https://graphql.contentful.com';
    const path = `/content/v1/spaces/${$config.contentful.spaceId}/environments/${$config.contentful.environmentId || 'master'}`;

    $axios = axios.create({
      baseURL: `${origin}${path}`
    });

    if (app && app.$axiosLogger) {
      $axios.interceptors.request.use(app.$axiosLogger);
    }
  }

  if ($config.redis.url && !$redis) {
    $redis = createRedisClient($config.redis);
  }

  const plugin = {
    $axios,

    $redis,

    key(alias, variables = {}) {
      return `@europeana:portal.js:contentful:${alias}:${new URLSearchParams(variables).toString()}`;
    },

    query(alias, variables = {}) {
      const cacheHashKey = this.key(alias, variables);
      return this.$redis ? this.cachedOrFresh(alias, variables, cacheHashKey) : this.fresh(cacheHashKey);
    },

    etagMatches(alias, variables, ifNoneMatchHeader) {
      if (!ifNoneMatchHeader) {
        return Promise.resolve(false);
      }
      const cacheHashKey = this.key(alias, variables);
      return this.$redis.hgetAsync(cacheHashKey, 'etag')
        .then(etag => etag === ifNoneMatchHeader);
    },

    fresh(alias, variables, cacheHashKey) {
      const accessToken = variables.preview ? $config.contentful.accessToken.preview : $config.contentful.accessToken.delivery;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Encoding': 'gzip'
      };
      const body = {
        query: queries[alias],
        variables
      };

      // const start = performance.now();

      return this.$axios.post('', body, { headers })
        .then(ctfResponse => {
          // const end = performance.now();
          // const duration = end - start;
          // console.log('CTF POST duration', duration);
          // console.log('ctfResponse.headers', ctfResponse.headers);

          const fresh = ctfResponse.data;
          const stringified = JSON.stringify(fresh);
          // TODO: reuse the etag from the CTF response instead?
          const etag = `W/"${md5(stringified)}"`;

          if (this.$redis) {
            this.$redis.hset(cacheHashKey, 'data', stringified);
            this.$redis.hset(cacheHashKey, 'etag', etag);
          }

          return Promise.resolve({
            data: fresh,
            etag
          });
        });
    },

    cachedOrFresh(alias, variables, cacheHashKey) {
      return this.$redis.hgetallAsync(cacheHashKey)
        .then(cached => {
          if (cached) {
            return Promise.resolve({ etag: cached.etag, data: JSON.parse(cached.data) });
          } else {
            return this.fresh(alias, variables, cacheHashKey);
          }
        });
    }
  };

  if (inject) {
    inject('contentful', plugin);
  }

  return plugin;
};
