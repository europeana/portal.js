import axios from 'axios';
import qs from 'qs';

import { apiError } from './utils';
import defaultConfig from './';

export default (config = defaultConfig) => ({
  annotationApiUrl(endpoint) {
    return `${config.annotation.url}${endpoint}`;
  },

  search(params) {
    return axios.get(this.annotationApiUrl('/search'), {
      // TODO: move serializer into utils as it's common to all APIs
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
      params: {
        ...params,
        ...{ wskey: config.annotation.key }
      }
    })
      .then((response) => {
        return response.data.items ? response.data.items : [];
      })
      .catch((error) => {
        throw apiError(error);
      });
  }
});
