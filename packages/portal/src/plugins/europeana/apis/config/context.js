import kebabCase from 'lodash/kebabCase.js';

export default class EuropeanaApiContextConfig {
  constructor(id, context = {}) {
    this.id = id;
    this.key = this.keyFromContext(context);
    this.url = this.urlFromContext(context);
    this.urlRewrite = this.urlRewriteFromContext(context);
    this.version = this.versionFromContext(context);
  }

  keyFromContext(context) {
    return context.$config?.europeana?.apis?.[this.id]?.key;
  }

  urlFromContext(context) {
    return this.apiUrlFromRequestHeaders(context.req?.headers) ||
      context.store?.state?.apis?.reqHeaderUrls?.[this.id] ||
      context.$config?.europeana?.apis[this.id]?.url;
  }

  urlRewriteFromContext(context) {
    if (this.apiUrlFromRequestHeaders(context.req?.headers) || context.store?.state?.apis?.reqHeaderUrls?.[this.id]) {
      return undefined;
    } else {
      return context.$config?.europeana?.apis?.[this.id]?.urlRewrite;
    }
  }

  versionFromContext(context) {
    return context.$config?.europeana?.apis?.[this.id]?.version;
  }

  apiUrlFromRequestHeaders(headers) {
    return headers?.[`x-europeana-${kebabCase(this.id)}-api-url`];
  }
}
