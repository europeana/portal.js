import { v4 as uuid } from 'uuid';

/**
 * Models a user session with id, timestamp and timeout.
 */
export default class Session {
  static DEFAULTS = {
    timeout: 30 // in minutes
  };

  #active = false;

  /**
   * @typedef {Object} SessionOptions
   * @property {number} timeout Number of minutes of inactivity after which a
   *  session will expire. Defaults to 30 minutes.
   */
  /**
   * @param {Object} data Session data
   * @param {string} data.id Session ID
   * @param {number} data.timestamp Session Unix timestamp
   * @param {SessionOptions} options Session options
   */
  constructor(data = {}, options = {}) {
    this.id = data?.id || uuid();
    this.timestamp = data?.timestamp || Date.now();
    this.timeout = options.timeout || this.constructor.DEFAULTS.timeout;
  }

  get hasExpired() {
    return Date.now() - this.timestamp > (this.timeout * 60 * 1000);
  }

  get isActive() {
    return !this.hasExpired && this.#active;
  }

  touch() {
    this.#active = true;
    this.timestamp = Date.now();
  }
}
