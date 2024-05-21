import snakeCase from 'lodash/snakeCase.js';

export default class EuropeanaApiEnvConfig {
  constructor(id) {
    this.id = id;

    this.key = this.keyFromEnv;
    this.url = this.urlFromEnv;
  }

  env(prop, { shared = false } = {}) {
    const apiSpecificInfix = shared ? '' : `_${snakeCase(this.id).toUpperCase()}`;
    const propInfix = snakeCase(prop).toUpperCase();

    return process.env[`EUROPEANA${apiSpecificInfix}_API_${propInfix}`];
  }

  get keyFromEnv() {
    return this.env('key', { shared: false }) ||
      this.env('key', { shared: true });
  }

  get urlFromEnv() {
    return this.env('url', { shared: false });
  }

  toJSON() {
    return JSON.stringify({
      key: this.key,
      id: this.id,
      url: this.url
    });
  }
}
