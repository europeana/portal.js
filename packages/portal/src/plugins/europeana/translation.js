import EuropeanaApi from './apis/base.js';

export default class EuropeanaTranslationApi extends EuropeanaApi {
  static ID = 'translation';
  static BASE_URL = 'https://api.europeana.eu/translation';
  static AUTHORISING = true;

  translate(data) {
    return this.request({
      method: 'post',
      url: '/translate',
      data: {
        service: 'ETRANSLATION',
        fallback: 'GOOGLE',
        caching: true,
        ...data
      }
    });
  }

  info() {
    return this.request({
      method: 'get',
      url: '/actuator/info'
    });
  }
}
