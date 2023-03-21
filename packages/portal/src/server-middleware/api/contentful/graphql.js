import camelCase from 'camelcase';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

import { errorHandler } from '../index.js';

const graphqlPaths = globSync(path.resolve(__dirname, './queries/*.graphql'));

const graphqlQueries = graphqlPaths.reduce((memo, graphqlPath) => {
  const basename = path.basename(graphqlPath, '.graphql');
  const alias = camelCase(basename);
  memo[alias] = fs.readFileSync(graphqlPath, 'utf8');
  return memo;
}, {});

const query = (axios, queryAlias, variables) => {
  const data = {
    query: graphqlQueries[queryAlias],
    variables
  };

  // These params will go into the URL query which will not be used by the
  // GraphQL service itself as it's a POST request, but facilitate intermediary
  // caching based on the URL alone, as with the apicache module.
  const params = {
    _query: queryAlias,
    variables
  };

  const requestConfig = {
    method: 'post',
    data,
    params
  };

  return axios.request(requestConfig);
};

export const middleware = (axios, req, res) => {
  const queryAlias = req.params.queryAlias;
  const variables = req.body;

  query(axios, queryAlias, variables)
    .then((response) => res.json(response.data))
    .catch((error) => {
      if (error.response) {
        error.message = error.response.data.errors?.[0]?.message || error.message;
      }
      errorHandler(res, error);
    });
};

export default query;
