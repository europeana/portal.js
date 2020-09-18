// TODO: remove this when the issue noted in the url plugin is resolved upstream
import { URL } from '../url';
import apiConfig from '../europeana';

function proxyMedia(mediaUrl, europeanaId, params = {}) {
  if (!params['api_url']) {
    // TODO: it is not ideal to hard-code "/api" here, but the media proxy
    //       expects Record API URLs to end thus, i.e. not /record or /api/v2
    params['api_url'] = new URL(apiConfig.record.url).origin + '/api';
  }

  const proxyUrl = new URL('https://proxy.europeana.eu');
  proxyUrl.pathname = europeanaId;
  proxyUrl.searchParams.append('view', mediaUrl);

  for (const name in params) {
    proxyUrl.searchParams.append(name, params[name]);
  }

  return proxyUrl.toString();
}

export default {
  install(Vue) {
    Vue.prototype.$proxyMedia = proxyMedia;
  }
};
