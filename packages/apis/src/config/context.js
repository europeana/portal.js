import kebabCase from 'lodash/kebabCase.js';

// TODO: this is all very nuxt-specific, and should be refactored and/or moved
//       out of the apis pkg
export default class EuropeanaApiContextConfig {
  constructor(id, context = {}) {
    this.id = id;
    this.key = this.keyFromContext(context);
    this.url = this.urlFromContext(context);
    this.urlRewrite = this.urlRewriteFromContext(context);
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

  apiUrlFromRequestHeaders(headers) {
    return headers?.[`x-europeana-${kebabCase(this.id)}-api-url`];
  }
}
