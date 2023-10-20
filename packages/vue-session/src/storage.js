/**
 * Handle storage (to localStorage) of user session data.
 */
export default class Storage {
  /**
   * @typedef {Object} StorageOptions
   * @property {string} prefix Prefix for the "session" localStorage key.
   *   Defaults to `''`.
   */
  /**
   * @param {StorageOptions} options Session storage options
   */
  constructor(options = {}) {
    const prefix = options.prefix || '';
    this.key = `${prefix}session`;
  }

  get data() {
    const data = localStorage.getItem(this.key);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  set data(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  empty() {
    localStorage.removeItem(this.key);
  }
}
