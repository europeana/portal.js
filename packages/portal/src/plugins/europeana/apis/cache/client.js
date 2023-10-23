import objectHash from 'object-hash';

class EuropeanaApiCacheClient {
  /**
   * Instance of Web API `Storage` class to write to, defaults to `sessionStorage`
   */
  #storage;

  constructor(storage) {
    this.#storage = storage || sessionStorage;
  }

  async fetch(requestConfig, callback) {
    const key = this.key(requestConfig);

    const responseData = this.get(key);
    if (responseData) {
      return { data: responseData };
    }

    return callback(requestConfig)
      .then((response) => {
        this.set(key, response.data);
        return response;
      });
  }

  key(requestConfig) {
    return `europeana.api.${objectHash(requestConfig)}`;
  }

  get(key) {
    try {
      return JSON.parse(this.#storage.getItem(key));
    } catch (err) {
      return undefined;
    }
  }

  // TODO: handle QuotaExceededError
  set(key, value) {
    return this.#storage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    return this.#storage.removeItem(key);
  }
}

export default EuropeanaApiCacheClient;
