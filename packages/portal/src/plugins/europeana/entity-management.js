import { BASE_URL as EUROPEANA_DATA_URL } from './data.js';
import { BASE_URL as EUROPEANA_ENTITY_API_BASE_URL } from './entity.js';
import { apiError, createKeycloakAuthAxios } from './utils.js';

export const BASE_URL = EUROPEANA_ENTITY_API_BASE_URL;
export const AUTHENTICATING = true;

export default (context = {}) => {
  const $axios = createKeycloakAuthAxios(
    { id: 'entityManagement', baseURL: BASE_URL, $axios: context.$axios },
    context
  );

  return {
    $axios,

    /**
     * Get an entity with given id, type
     * @param {string} id the entity's URI
     * @param {Object} options retrieval options
     * @param {string} options.profile the entity's metadata profile
     * @return {Object} the entity object
     */
    get(id, options = {}) {
      const defaults = {
        profile: 'internal'
      };
      const params = { ...defaults, ...options };
      return $axios.get(id.replace(EUROPEANA_DATA_URL, ''), { params })
        .then(response => response.data)
        .catch(error => {
          throw apiError(error, context);
        });
    },

    /**
     * Update the body of the entity
     * @param {string} id the entity's URI
     * @param {Object} body the Proxy body
     * @return {Object} API response data
     */
    update(id, body) {
      return $axios.put(id.replace(EUROPEANA_DATA_URL, ''), body)
        .then(response => response.data)
        .catch(error => {
          throw apiError(error, context);
        });
    }
  };
};
