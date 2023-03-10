import axios from 'axios';
import axiosRetry from 'axios-retry';
import graphql from './graphql.js';

export default function createInstance(config = {}) {
  const instance = {
    graphql
  };

  const configDefaults = {
    graphQlOrigin: 'https://graphql.contentful.com',
    environmentId: 'master'
  };
  instance.config = { ...config };
  for (const key in configDefaults) {
    instance.config[key] = instance.config[key] || configDefaults[key];
  }

  const baseURL = `${instance.config.graphQlOrigin}/content/v1/spaces/${instance.config.spaceId}/environments/${instance.config.environmentId}`;

  instance.axios = axios.create({
    baseURL
  });
  axiosRetry(instance.axios);

  return instance;
}
