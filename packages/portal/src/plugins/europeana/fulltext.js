import EuropeanaApi from './apis/base.js';

export default class EuropeanaFulltextApi extends EuropeanaApi {
  static ID = 'fulltext';
  static BASE_URL = 'https://newspapers.eanadev.org/api/v2';
}
