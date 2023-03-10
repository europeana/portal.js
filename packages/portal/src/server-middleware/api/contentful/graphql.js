import camelCase from 'camelcase';
import createHttpError from 'http-errors';
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

export function queryContentful(queryAlias, variables) {
  const accessToken = variables.preview ? this.config.accessToken.preview : this.config.accessToken.delivery;

  const data = {
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

  const requestConfig = {
    method: 'post',
    data,
    headers,
    params
  };

  return this.axios.request(requestConfig);
}

export default function(req, res) {
  this.queryContentful = queryContentful;

  const queryAlias = req.params.queryAlias;
  const variables = req.body;

  return this.queryContentful(queryAlias, variables)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      if (error.response) {
        error = createHttpError(error.response.status, error.response.data.errors?.[0]?.message || error.message);
      }
      errorHandler(res, error);
    });
}
