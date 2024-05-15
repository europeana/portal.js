import EuropeanaApi from './base.js';

export default class EuropeanaRecommendationApi extends EuropeanaApi {
  static ID = 'recommendation';
  static BASE_URL = 'https://api.europeana.eu/recommend';
  static AUTHENTICATING = true;
  static AUTHORISING = true;

  /**
   * Get recommended items for a set or item
   *
   * @param {string} type what to get recommendations for, "set" or "record" (i.e. item)
   * @param {string} identifier ID of the set or item, with leading slash
   * @return {string[]} array of identifiers of recommended items
   */
  recommend(type, identifier) {
    return this.request({
      method: 'get',
      url: `/${type}${identifier}`
    });
  }

  accept(type, identifier, data) {
    return this.request({
      method: 'post',
      url: `/${type}${identifier}`,
      data
    });
  }

  reject(type, identifier, data) {
    return this.request({
      method: 'delete',
      url: `/${type}${identifier}`,
      data
    });
  }
}
