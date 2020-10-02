import axios from 'axios';
import qs from 'qs';

import { apiError } from './utils';

// TODO: replace with API gateway origin when it works
export const BASE_URL = process.env.EUROPEANA_ANNOTATION_API_URL || 'https://annotations.europeana.eu/annotation';
export const createAxios = (defaults = {}) => {
  return axios.create({
    baseURL: BASE_URL,
    params: {
      wskey: process.env.EUROPEANA_ANNOTATION_API_KEY || process.env.EUROPEANA_API_KEY
    },
    ...defaults
  });
};

export default (axiosDefaults) => {
  const $axios = createAxios(axiosDefaults);

  return {
    search(params) {
      return $axios.get('/search', {
        // TODO: move serializer into utils as it's common to all APIs
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        params: {
          ...$axios.defaults.params,
          ...params
        }
      })
        .then(response => response.data.items ? response.data.items : [])
        .catch(error => {
          throw apiError(error);
        });
    }
  };
};
