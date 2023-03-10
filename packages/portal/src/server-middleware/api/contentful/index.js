import axios from 'axios';
import axiosRetry from 'axios-retry';

import { middleware as graphqlMiddleware } from './graphql.js';
import { middleware as storiesMiddleware } from './stories.js';

export const createInstanceConfig = (config = {}) => {
  const instanceConfig = { ...config };

  const configDefaults = {
    graphQlOrigin: 'https://graphql.contentful.com',
    environmentId: 'master'
  };
  for (const key in configDefaults) {
    instanceConfig[key] = instanceConfig[key] || configDefaults[key];
  }

  return instanceConfig;
};

export const createAxiosInstance = (config = {}) => {
  const instanceConfig = createInstanceConfig(config);

  const baseURL = `${instanceConfig.graphQlOrigin}/content/v1/spaces/${instanceConfig.spaceId}/environments/${instanceConfig.environmentId}`;

  const axiosInstance = axios.create({
    baseURL
  });
  axiosInstance.interceptors.request.use((requestConfig) => {
    const accessToken = requestConfig.data.variables.preview ? instanceConfig.accessToken.preview : instanceConfig.accessToken.delivery;
    requestConfig.headers['Authorization'] = `Bearer ${accessToken}`;
    return requestConfig;
  });
  axiosRetry(axiosInstance);

  return axiosInstance;
};

export default (config = {}) => {
  const axiosInstance = createAxiosInstance(config);

  return {
    graphql: graphqlMiddleware.bind(null, axiosInstance),
    stories: storiesMiddleware.bind(null, axiosInstance)
  };
};
