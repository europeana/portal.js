import EuropeanaApi from './apis/utils/base.js';
import { BASE_URL as EUROPEANA_DATA_URL } from './data.js';
import EuropeanaEntityApi from './entity.js';

export default class EuropeanaEntityManagementApi extends EuropeanaApi {
  static ID = 'entityManagement';
  static BASE_URL = EuropeanaEntityApi.BASE_URL;
  static AUTHENTICATING = true;
  static AUTHORISING = true;

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
    return this.axios.get(id.replace(EUROPEANA_DATA_URL, ''), { params })
      .then(response => response.data)
      .catch(error => {
        throw this.apiError(error);
      });
  }

  /**
   * Update the body of the entity
   * @param {string} id the entity's URI
   * @param {Object} body the Proxy body
   * @return {Object} API response data
   */
  update(id, body) {
    return this.axios.put(id.replace(EUROPEANA_DATA_URL, ''), body, { timeout: 15000 })
      .then(response => response.data)
      .catch(error => {
        throw this.apiError(error);
      });
  }
}
