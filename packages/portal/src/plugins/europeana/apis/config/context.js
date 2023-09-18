import kebabCase from 'lodash/kebabCase.js';

export default class EuropeanaApiContextConfig {
  constructor(id, context = {}) {
    this.id = id;
    this.key = this.keyFromContext(context);
    this.url = this.urlFromContext(context);
  }

  keyFromContext(context) {
    return context.$config?.europeana?.apis?.[this.id]?.key;
  }

  urlFromContext(context) {
    return this.apiUrlFromRequestHeaders(context.req?.headers) ||
      context.store?.state?.apis?.reqHeaderUrls?.[this.id] ||
      context.$config?.europeana?.apis[this.id]?.url;
  }

  apiUrlFromRequestHeaders(headers) {
    return headers?.[`x-europeana-${kebabCase(this.id)}-api-url`];
  }
}
