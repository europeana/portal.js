import { apiError } from './utils';

export const BASE_URL = process.env.EUROPEANA_RECOMMENDATION_API_URL || 'https://api.europeana.eu/recommend';

const apiUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export default ($axios) => ({
  /**
   * Get recommended items for a set or item
   *
   * @param {string} type what to get recommendations for, "set" or "record" (i.e. item)
   * @param {string} identifier ID of the set or item, with leading slash
   * @return {string[]} array of identifiers of recommended items
   */
  recommend(type, identifier) {
    return $axios.get(apiUrl(`/${type}${identifier}`))
      .then(response => response.data)
      .catch(error => {
        throw apiError(error);
      });
  }
});
