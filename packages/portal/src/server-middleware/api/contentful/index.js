import axios from 'axios';
import axiosRetry from 'axios-retry';
import camelCase from 'camelcase';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

import { errorHandler } from '../index.js';

const graphqlPaths = glob.sync(path.resolve(__dirname, './queries/*.graphql'));

const graphqlQueries = graphqlPaths.reduce((memo, graphqlPath) => {
  const basename = path.basename(graphqlPath, '.graphql');
  const alias = camelCase(basename);
  memo[alias] = fs.readFileSync(graphqlPath, 'utf8');
  return memo;
}, {});

export default (config = {}) => (req, res) => {
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance);

  const queryAlias = req.params.queryAlias;
  const variables = req.query;
  variables.preview = variables.preview === 'true' ? true : false;

  // console.log('req', queryAlias, variables)


  const origin = config.graphQlOrigin || 'https://graphql.contentful.com';
  const path = `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId || 'master'}`;

  const accessToken = variables.preview ? config.accessToken.preview : config.accessToken.delivery;

  // console.log('query', graphqlQueries[queryAlias])

  const body = {
    query: graphqlQueries[queryAlias],
    variables
  };

  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  // These params will go into the URL query which will not be used by the
  // GraphQL service itself as it's a POST request, but facilitate intermediary
  // caching based on the URL alone, as with the apicache module.
  const params = {
    _query: queryAlias,
    variables
  };

  console.log('CTF', `${origin}${path}`, body, { headers, params })

  return axiosInstance.post(`${origin}${path}`, body, { headers, params })
    .then((response) => {
      console.log('response')
      res.json(response.data);
    })
    .catch((error) => {
      // TODO: handle better here
      console.error('error', error.response.data)
      errorHandler(res, error)
    });
};
