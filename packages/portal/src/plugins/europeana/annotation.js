import qs from 'qs';

import { apiError, createAxios } from './utils';

export const BASE_URL = 'https://api.europeana.eu/annotation';

export default async(context = {}) => {
  const $axios = await createAxios({ id: 'annotation', baseURL: BASE_URL }, context);

  return {
    $axios,

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
          throw apiError(error, context);
        });
    }
  };
};
