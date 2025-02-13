import snakeCase from 'lodash/snakeCase.js';

export default class EuropeanaApiEnvConfig {
  constructor(id, scope) {
    this.id = id;
    this.scope = scope;

    this.key = this.keyFromEnv;
    this.unavailable = this.unavailableFromEnv;
    this.url = this.urlFromEnv;
    this.urlRewrite = this.urlRewriteFromEnv;
    this.version = this.versionFromEnv;
  }

  env(prop, { boolean = false, shared = false } = {}) {
    const apiSpecificInfix = shared ? '' : `_${snakeCase(this.id).toUpperCase()}`;
    const propInfix = snakeCase(prop).toUpperCase();

    const val = process.env[`EUROPEANA${apiSpecificInfix}_API_${propInfix}`];
    return boolean ? Boolean(val) : val;
  }

  get keyFromEnv() {
    return this.env('key', { shared: false }) ||
      this.env('key', { shared: true });
  }

  get unavailableFromEnv() {
    return this.env('unavailable', { boolean: true, shared: false });
  }

  get urlFromEnv() {
    return this.env('url', { shared: false });
  }

  get urlRewriteFromEnv() {
    let urlRewriteFromEnv;

    if (this.scope === 'private') {
      urlRewriteFromEnv = this.env('urlPrivate', { shared: false });
    }

    return urlRewriteFromEnv;
  }

  get versionFromEnv() {
    return this.env('version', { shared: false });
  }

  toJSON() {
    return JSON.stringify({
      key: this.key,
      id: this.id,
      scope: this.scope,
      url: this.url,
      urlRewrite: this.urlRewrite,
      version: this.version
    });
  }
}
