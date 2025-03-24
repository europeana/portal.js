import md5 from 'md5';

import EuropeanaApi from './apis/base.js';

import search from './search.js';

import { ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX } from './data.js';
import EuropeanaMediaProxyApi from './media-proxy.js';

export default class EuropeanaRecordApi extends EuropeanaApi {
  static ID = 'record';
  static BASE_URL = 'https://api.europeana.eu/record';
  static AUTHENTICATING = true;
  static AUTHORISING = true;

  get search() {
    return search.bind(this);
  }

  /**
   * Find records by their identifier
   * @param {Array} europeanaIds record identifiers or URIs
   * @param {Object} params additional options to include in the API search query
   * @return {Array} record data as returned by the API
   */
  find(europeanaIds, params = {}) {
    europeanaIds = europeanaIds.map((id) => id.replace(EUROPEANA_DATA_URL_ITEM_PREFIX, ''));
    const query = `europeana_id:("${europeanaIds.join('" OR "')}")`;
    return this.search({
      query,
      ...params
    });
  }

  /**
   * Get the record data from the API
   * @param {string} europeanaId ID of Europeana record
   * @return {Object} record data
   */
  async get(europeanaId, params = {}) {
    let path = '';
    if (!this.axios.defaults.baseURL.endsWith('/record')) {
      path = '/record';
    }

    return this.request({
      method: 'get',
      url: `${path}${europeanaId}.json`,
      params
    });
  }

  // TODO: move to media-proxy.js
  mediaProxyUrl(mediaUrl, europeanaId, params = {}) {
    if (!mediaUrl) {
      return undefined;
    }

    params.recordApiUrl = this.baseURL;

    const proxyUrl = new URL(this.context?.$apis?.mediaProxy?.baseURL || EuropeanaMediaProxyApi.BASE_URL);

    proxyUrl.pathname = `${proxyUrl.pathname}${europeanaId}/${md5(mediaUrl)}`;
    if (proxyUrl.pathname.startsWith('//')) {
      proxyUrl.pathname = proxyUrl.pathname.slice(1);
    }

    for (const name in params) {
      proxyUrl.searchParams.append(name, params[name]);
    }

    return proxyUrl.toString();
  }
}

/**
 * Tests whether a string is a valid Europeana record ID.
 * @param {string} value Value to test
 * @return {Boolean}
 */
export function isEuropeanaRecordId(value) {
  return /^\/\d+\/\w+$/.test(value);
}

/**
 * Extracts a Record Id from a URL
 * Supported formats:
 *  ID: /90402/SK_A_2344
 *  URI: http://data.europeana.eu/item/90402/SK_A_2344
 *  Website URL: http(s)://www.europeana.eu/($LOCALE/)item/90402/SK_A_2344
 * @param {string} value URL
 * @return {string}
 */
export function recordIdFromUrl(value) {
  const urlMatch = /(\/\d+\/\w+)($|\?)/.exec(value);
  return urlMatch?.[1];
}
