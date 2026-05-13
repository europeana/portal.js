import EuropeanaApi from './apis/base.js';

export default class EuropeanaFulltextApi extends EuropeanaApi {
  static ID = 'fulltext';
  // NOTE: full text does not work via API gateway
  // static BASE_URL = 'https://api.europeana.eu/fulltext';
  static BASE_URL = 'https://newspapers.eanadev.org/api/v2';
}
