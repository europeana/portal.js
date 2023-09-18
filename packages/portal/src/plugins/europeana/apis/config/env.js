import snakeCase from 'lodash/snakeCase.js';

export default class EuropeanaApiEnvConfig {
  constructor(id, scope) {
    this.id = id;
    this.scope = scope;

    this.key = this.keyFromEnv;
    this.url = this.urlFromEnv;
  }

  env(prop, { serverSide = false, shared = false } = {}) {
    const apiSpecificInfix = shared ? '' : `_${snakeCase(this.id).toUpperCase()}`;
    const privateSuffix = serverSide ? '_PRIVATE' : '';
    const propInfix = prop.toUpperCase();

    return process.env[`EUROPEANA${apiSpecificInfix}_API_${propInfix}${privateSuffix}`];
  }

  get keyFromEnv() {
    let keyFromEnv;

    if (this.scope === 'public') {
      keyFromEnv = this.env('key', { serverSide: false, shared: false }) ||
        this.env('key', { serverSide: false, shared: true });
    } else if (this.scope === 'private') {
      keyFromEnv = this.env('key', { serverSide: true, shared: false }) ||
        this.env('key', { serverSide: true, shared: true }) ||
        this.env('key', { serverSide: false, shared: false }) ||
        this.env('key', { serverSide: false, shared: true });
    }

    return keyFromEnv;
  }

  get urlFromEnv() {
    let urlFromEnv;

    if (this.scope === 'public') {
      urlFromEnv = this.env('url', { serverSide: false, shared: false });
    } else if (this.scope === 'private') {
      urlFromEnv = this.env('url', { serverSide: true, shared: false }) ||
        this.env('url', { serverSide: false, shared: false });
    }

    return urlFromEnv;
  }

  toJSON() {
    return JSON.stringify({
      key: this.key,
      id: this.id,
      scope: this.scope,
      url: this.url
    });
  }
}
