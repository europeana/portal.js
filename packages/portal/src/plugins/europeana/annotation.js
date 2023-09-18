import EuropeanaApi from './apis/base.js';

export default class EuropeanaAnnotationApi extends EuropeanaApi {
  static ID = 'annotation';
  static BASE_URL = 'https://api.europeana.eu/annotation';
  static AUTHENTICATING = true;

  async search(params) {
    try {
      const response = await this.axios.get('/search', {
        params: {
          ...this.axios.defaults.params,
          ...params
        }
      });
      return response.data.items ? response.data.items : [];
    } catch (error) {
      throw this.apiError(error);
    }
  }
}
