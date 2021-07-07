import { apiError, createKeycloakAuthAxios } from './utils';
import { getEntityUrl } from './entity';

export const BASE_URL = process.env.EUROPEANA_ENTITY_MANAGEMENT_API_URL || 'https://api.europeana.eu/entity';

export default (context = {}) => {
  const $axios = createKeycloakAuthAxios(
    { id: 'entityManagement', baseURL: BASE_URL, $axios: context.$axios },
    context
  );

  return {
    $axios,

    /**
     * Get an entity with given id, type
     * @param {string} type the type of the entity,
     * @param {string} id the entity's id
     * @param {Object} options retrieval options
     * @param {string} options.profile the entity's metadata profile
     * @return {Object} the entity object
     */
    getEntity(type, id, options = {}) {
      const defaults = {
        profile: 'internal'
      };
      const params = { ...defaults, ...options };
      return $axios.get(getEntityUrl(type, id).replace('.json', ''), { params })
        .then(response => response.data)
        .catch(error => apiError(error));
    },

    /**
     * Update the body of the entity
     * @param {string} id the entity's id
     * @param {Object} body the Proxy body
     * @return {Object} API response data
     */
    updateEntity(id, body) {
      return $axios.put(`/concept/base/${id}`, body)
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    }

  };
};
