// TODO: use @vue/apollo-composable instead

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { print as printGraphql } from 'graphql/language/printer';

import * as queries from './graphql/queries/index.js';

export default ({ $apm, $config }) => {
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance);

  const config = $config.contentful;
  const origin = config.graphQlOrigin || 'https://graphql.contentful.com';
  const path = `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId || 'master'}`;

  return (alias, variables = {}) => {
    const accessToken = variables.preview ? config.accessToken.preview : config.accessToken.delivery;

    const ast = queries[alias];
    // TODO: memoise
    const query = printGraphql(ast);

    const body = {
      query,
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

    return axiosInstance.post(`${origin}${path}`, body, { headers, params })
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
