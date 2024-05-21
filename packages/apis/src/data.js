import EuropeanaApi from './base.js';

export const EUROPEANA_DATA_API_BASE_URL = 'http://data.europeana.eu';
export const EUROPEANA_DATA_API_ITEM_URL_PREFIX = `${EUROPEANA_DATA_API_BASE_URL}/item`;
export const EUROPEANA_DATA_API_SET_URL_PREFIX = `${EUROPEANA_DATA_API_BASE_URL}/set`;

export default class EuropeanaDataApi extends EuropeanaApi {
  static ID = 'data';
  static BASE_URL = EUROPEANA_DATA_API_BASE_URL;
  static ITEM_URL_PREFIX = EUROPEANA_DATA_API_ITEM_URL_PREFIX;
  static SET_URL_PREFIX = EUROPEANA_DATA_API_SET_URL_PREFIX;
}
