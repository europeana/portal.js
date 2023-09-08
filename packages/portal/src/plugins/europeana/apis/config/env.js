import snakeCase from 'lodash/snakeCase.js';

export default class EuropeanaApiEnvConfig {
  constructor(id, scope) {
    this.id = id;
    this.scope = scope;

    this.envKeyPrefix = `EUROPEANA_${snakeCase(id).toUpperCase()}_API_`;
    this.envKeySuffix = scope === 'public' ? '' : `_${scope.toUpperCase()}`;

    this.key = this.keyFromEnv;
    this.url = this.urlFromEnv;
  }

  get keyFromEnv() {
    let keyFromEnv;

    if (process.env[`${this.envKeyPrefix}KEY${this.envKeySuffix}`]) {
      // API-specific key
      keyFromEnv = process.env[`${this.envKeyPrefix}KEY${this.envKeySuffix}`];
    } else if (process.env[`EUROPEANA_API_KEY${this.envKeySuffix}`]) {
      // Shared API key
      keyFromEnv = process.env[`EUROPEANA_API_KEY${this.envKeySuffix}`];
    }

    return keyFromEnv;
  }

  get urlFromEnv() {
    let urlFromEnv;

    if (process.env[`${this.envKeyPrefix}URL${this.envKeySuffix}`]) {
      // Overriden API URL
      urlFromEnv = process.env[`${this.envKeyPrefix}URL${this.envKeySuffix}`];
    }

    return urlFromEnv;
  }
}
