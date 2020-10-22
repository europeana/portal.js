import axios from 'axios';
import qs from 'qs';

import { apiError } from './utils';

// TODO: replace with API gateway origin when it works
export const BASE_URL = process.env.EUROPEANA_ANNOTATION_API_URL || 'https://api.europeana.eu/annotation';
export const axiosDefaults = {
  baseURL: BASE_URL,
  params: {
    wskey: process.env.EUROPEANA_ANNOTATION_API_KEY || process.env.EUROPEANA_API_KEY
  }
};

export default (axiosOverrides) => {
  return {
    $axios: axios.create({
      ...axiosDefaults,
      ...axiosOverrides
    }),

    search(params) {
      return this.$axios.get('/search', {
        // TODO: move serializer into utils as it's common to all APIs
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        params: {
          ...this.$axios.defaults.params,
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
