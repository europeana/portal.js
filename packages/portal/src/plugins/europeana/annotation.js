import EuropeanaApi from './apis/base.js';

export default class EuropeanaAnnotationApi extends EuropeanaApi {
  static ID = 'annotation';
  static BASE_URL = 'https://api.europeana.eu/annotation';
  static AUTHENTICATING = true;

  async search(params = {}) {
    const response = await this.request({
      method: 'get',
      url: '/search',
      params
    });

    return response.items || [];
  }
}
