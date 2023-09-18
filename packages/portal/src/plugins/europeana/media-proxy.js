import EuropeanaApi from './apis/base.js';

export default class EuropeanaMediaProxyApi extends EuropeanaApi {
  static ID = 'mediaProxy';
  static BASE_URL = 'https://proxy.europeana.eu/media';
}
