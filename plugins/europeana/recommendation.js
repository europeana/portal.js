import { config } from './';
import { apiError } from './utils';

const apiUrl = (endpoint) => `${config.recommendation.origin}${config.recommendation.path}${endpoint}`;

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
