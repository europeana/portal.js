import EuropeanaApi from './base.js';

export default class EuropeanaDataApi extends EuropeanaApi {
  static BASE_URL = 'http://data.europeana.eu';
  static ITEM_URL_PREFIX = `${this.BASE_URL}/item`;
  static SET_URL_PREFIX = `${this.BASE_URL}/set`;
}
