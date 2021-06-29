import axios from 'axios';

// TODO: move `createRedisClient` and other related utils up to cachers dir
import { createRedisClient } from '../../cachers/entities/organisations/utils';

import queries from './queries';

// console.log('queries', queries);

const $axios = axios.create();
let redisClient;

export default ({ app, $config }, inject) => {
  if (app && app.$axiosLogger) {
    $axios.interceptors.request.use(app.$axiosLogger);
  }

  if ($config.redis.url) {
    redisClient = createRedisClient({
      redisUrl: $config.redis.url,
      redisTlsCa: $config.redis.tlsCa
    });
  }

  const plugin = {
    $axios,

    async query(alias, variables = {}) {
      // const cacheHashKey = `@europeana:portal.js:contentful:${alias}`;
      // const cacheHashField = new URLSearchParams(variables).toString();
      const cacheHashKey = `@europeana:portal.js:contentful:${alias}:${new URLSearchParams(variables).toString()}`;

      // Look in the cache, if there is one
      if (redisClient) {
        // const cached = await redisClient.hgetAsync(cacheHashKey, cacheHashField);
        const cached = await redisClient.getAsync(cacheHashKey);
        if (cached) {
          // console.log('cached', cacheHashKey);
          return Promise.resolve({ data: JSON.parse(cached) });
        }
      }

      // If nothing cached, fetch from CTF
      const origin = 'https://graphql.contentful.com';
      const path = `/content/v1/spaces/${this.config.spaceId}/environments/${this.config.environmentId || 'master'}`;

      const accessToken = variables.preview ? this.config.accessToken.preview : this.config.accessToken.delivery;

      const body = {
        query: queries[alias],
        variables
      };

      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };

      return this.$axios.post(`${origin}${path}`, body, { headers })
        .then(ctfResponse => {
          const fresh = ctfResponse.data;
          // console.log('fresh', cacheHashKey);
          if (redisClient) {
            // redisClient.hset(cacheHashKey, cacheHashField, JSON.stringify(fresh));
            redisClient.set(cacheHashKey, JSON.stringify(fresh), 'ex', 60 * 5);
          }
          return Promise.resolve({ data: fresh });
        });
    }
  };

  plugin.config = $config.contentful;

  if (inject) {
    inject('contentful', plugin);
  }

  return plugin;
};
