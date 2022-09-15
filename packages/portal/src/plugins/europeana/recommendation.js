import { apiError, createKeycloakAuthAxios } from './utils';

export const BASE_URL = process.env.EUROPEANA_RECOMMENDATION_API_URL || 'https://api.europeana.eu/recommend';

export default (context = {}) => {
  const $axios = createKeycloakAuthAxios(
    { id: 'recommendation', baseURL: BASE_URL, $axios: context.$axios },
    context
  );

  return {
    $axios,

    /**
     * Get recommended items for a set or item
     *
     * @param {string} type what to get recommendations for, "set" or "record" (i.e. item)
     * @param {string} identifier ID of the set or item, with leading slash
     * @return {string[]} array of identifiers of recommended items
     */
    recommend(type, identifier) {
      return $axios.get(`/${type}${identifier}`)
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    accept(type, identifier, body) {
      return $axios.post(
        `/${type}${identifier}`,
        body
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    reject(type, identifier, body) {
      return $axios.delete(
        `/${type}${identifier}`,
        { data: body }
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    }
  };
};
