import EuropeanaApi from './apis/base.js';

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
    return this.axios.get(`/${type}${identifier}`)
      .then(response => response.data)
      .catch(error => {
        throw this.apiError(error);
      });
  }

  accept(type, identifier, body) {
    return this.axios.post(
      `/${type}${identifier}`,
      body
    )
      .then(response => response.data)
      .catch(error => {
        throw this.apiError(error);
      });
  }

  reject(type, identifier, body) {
    return this.axios.delete(
      `/${type}${identifier}`,
      { data: body }
    )
      .then(response => response.data)
      .catch(error => {
        throw this.apiError(error);
      });
  }
}
