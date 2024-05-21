import EuropeanaApi from '../base.js';
import search from './search.js';
import EuropeanaDataApi from '../data.js';

export default class EuropeanaRecordApi extends EuropeanaApi {
  static ID = 'record';
  static BASE_URL = 'https://api.europeana.eu/record';
  static AUTHENTICATING = true;
  static AUTHORISING = true;

  get search() {
    return search.bind(this);
  }

  /**
   * Find records by their identifier
   * @param {Array} europeanaIds record identifiers or URIs
   * @param {Object} params additional options to include in the API search query
   * @return {Array} record data as returned by the API
   */
  find(europeanaIds, params = {}) {
    europeanaIds = europeanaIds.map(id => id.replace(EuropeanaDataApi.ITEM_URL_PREFIX, ''));
    const query = `europeana_id:("${europeanaIds.join('" OR "')}")`;
    return this.search({
      query,
      ...params
    });
  }

  /**
   * Get the record data from the API
   * @param {string} europeanaId ID of Europeana record
   * @return {Object} record data
   */
  async get(europeanaId, params = {}) {
    let path = '';
    if (!this.axios.defaults.baseURL.endsWith('/record')) {
      path = '/record';
    }

    return this.request({
      method: 'get',
      url: `${path}${europeanaId}.json`,
      params
    });
  }
}
