// TODO: use @vue/apollo-composable instead

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { print as printGraphql } from 'graphql/language/printer';
import { getCurrentInstance } from 'vue';

export function useContentfulGraphql() {
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance);

  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const query = (ast, variables = {}) => {
    const $apm = $root.$apm;
    const $config = $root.$config;

    const config = $config?.contentful || {};
    const origin = config.graphQlOrigin || 'https://graphql.contentful.com';
    const path = `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId || 'master'}`;

    const accessToken = variables.preview ? config.accessToken?.preview : config.accessToken?.delivery;

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
      _query: ast?.definitions?.[0]?.name?.value,
      ...variables
    };

    try {
      return axiosInstance.post(`${origin}${path}`, body, { headers, params });
    } catch (error) {
      $apm?.captureError(error, {
        custom: {
          code: error.code
        }
      });
      throw error;
    }
  };

  return {
    query
  };
}
