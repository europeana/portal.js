// QUESTION: use @vue/apollo-composable instead?

import fetch from 'node-fetch';
import { print as printGraphql } from 'graphql/language/printer.js';

const createQueryInstance = (config = {}) => {
  const origin = config.graphQlOrigin || 'https://graphql.contentful.com';
  const path = `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId || 'master'}`;

  const queryInstance = async(ast, variables = {}) => {
    const accessToken = variables.preview ? config.accessToken?.preview : config.accessToken?.delivery;

    const url = new URL(`${origin}${path}`);
    // These params will go into the URL query which will not be used by the
    // GraphQL service itself as it's a POST request, but facilitate intermediary
    // caching based on the URL alone, as with the apicache module.
    url.search = new URLSearchParams({
      _query: ast?.definitions?.[0]?.name?.value,
      ...variables
    }).toString();

    const query = printGraphql(ast);
    const body = JSON.stringify({
      query,
      variables
    });

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const method = 'post';

    const response = await fetch(url, {
      body,
      headers,
      method
    });

    const json = await response.json();

    return json;
  };

  return queryInstance;
};

const VueContentfulGraphql = {
  install(app, config) {
    // NOTE: when only vue 3 compatibility is needed, global provide/inject will be a
    //       better approach than global properties
    const target = (app.version > '3') ? app.config.globalProperties : app.prototype;
    target.$contentful ||= {};
    target.$contentful.query = createQueryInstance(config);
  }
};

export default VueContentfulGraphql;
