const axios = require('axios');

const CACHE_KEY = '@europeana:portal.js:items:recent';

const axiosConfig = (config = {}) => {
  return {
    baseURL: config.europeana.apis.record.url || 'https://api.europeana.eu/record',
    params: {
      wskey: config.europeana.apis.record.key
    }
  };
};

const createAxiosClient = (config = {}) => axios.create(axiosConfig(config));

module.exports = {
  CACHE_KEY,
  createAxiosClient
};
