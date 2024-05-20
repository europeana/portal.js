import md5 from 'md5';
import EuropeanaApi from './base.js';

export default class EuropeanaMediaProxyApi extends EuropeanaApi {
  static ID = 'mediaProxy';
  static BASE_URL = 'https://proxy.europeana.eu/media';

  url(mediaUrl, europeanaId, params = {}) {
    const proxyUrl = new URL(this.baseURL);

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
