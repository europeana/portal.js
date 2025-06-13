// QUESTION: use @vue/apollo-composable instead?

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { print as printGraphql } from 'graphql/language/printer.js';

const createQueryInstance = (config = {}) => {
  //  TODO: rm dependency on axios
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance);

  const origin = config.graphQlOrigin || 'https://graphql.contentful.com';
  const path = `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId || 'master'}`;

  const queryInstance = (ast, variables = {}) => {
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

    return axiosInstance.post(`${origin}${path}`, body, { headers, params });
  };

  return queryInstance;
};

const VueContentfulGraphql = {
  install(app, config) {
    // NOTE: when only vue 3 compatibility is needed, global provide/inject will be a
    //       better approach than global properties
    const target = (app.version > '3') ? app.config.globalProperties : app.prototype
    target.$contentful ||= {};
    target.$contentful.query = createQueryInstance(config);
  }
};

export default VueContentfulGraphql;
