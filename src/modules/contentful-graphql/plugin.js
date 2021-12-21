import axios from 'axios';
import axiosRetry from 'axios-retry';

import queries from './queries';

export default ({ app, $config, $apm }, inject) => {
  const $axios = axios.create();
  axiosRetry($axios);

  if (app.$axiosLogger) {
    $axios.interceptors.request.use(app.$axiosLogger);
  }

  const plugin = {
    $axios,
    query(alias, variables = {}) {
      const origin = this.config.graphQlOrigin || 'https://graphql.contentful.com';
      const path = `/content/v1/spaces/${this.config.spaceId}/environments/${this.config.environmentId || 'master'}`;

      const accessToken = variables.preview ? this.config.accessToken.preview : this.config.accessToken.delivery;

      const body = {
        query: queries[alias],
        variables
      };

      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };

      // These params will go into the URL query which will not be used by the
      // GraphQL service itself as it's a POST request, but facilitate intermediary
      // caching based on the URL alone, as with the apicache module.
      const params = {
        _query: alias,
        ...variables
      };

      return this.$axios.post(`${origin}${path}`, body, { headers, params })
        .catch((error) => {
          if ($apm?.captureError) {
            $apm.captureError(error, {
              custom: {
                code: error.code
              }
            });
          }
          throw error;
        });
    }
  };

  plugin.config = $config.contentful;

  inject('contentful', plugin);
};
