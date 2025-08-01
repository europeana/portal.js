import EuropeanaApi from './apis/base.js';
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

    return this.request({
      method: 'get',
      url: id.replace(EUROPEANA_DATA_URL, ''),
      params
    });
  }

  /**
   * Update the body of the entity
   * @param {string} id the entity's URI
   * @param {Object} data the Proxy body
   * @return {Object} API response data
   */
  update(id, data) {
    return this.request({
      method: 'put',
      url: id.replace(EUROPEANA_DATA_URL, ''),
      data,
      timeout: 15000
    });
  }
}
