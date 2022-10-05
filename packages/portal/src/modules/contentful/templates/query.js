import axios from 'axios';
import axiosRetry from 'axios-retry';

import queries from './queries';

const axiosOptions = {};

export default async({ $apm, $config }) => {
  if (process.server) {
    if (!axiosOptions.httpAgent) {
      const http = await import('http');
      axiosOptions.httpAgent = new http.Agent({ keepAlive: true });
    }
    if (!axiosOptions.httpsAgent) {
      const https = await import('https');
      axiosOptions.httpsAgent = new https.Agent({ keepAlive: true });
    }
  }

  const $axios = axios.create(axiosOptions);
  axiosRetry($axios);

  const config = $config.contentful;
  const origin = config.graphQlOrigin || 'https://graphql.contentful.com';
  const path = `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId || 'master'}`;

  return (alias, variables = {}) => {
    const accessToken = variables.preview ? config.accessToken.preview : config.accessToken.delivery;

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

    return $axios.post(`${origin}${path}`, body, { headers, params })
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
  };
};
