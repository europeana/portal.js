import Monitor from './monitor.js';
import Session from './session.js';
import Storage from './storage.js';
import Vue from 'vue';

/**
 * Manages session(s) for the user
 */
export default class Manager {
  #monitor;
  #session;
  #storage;

  /**
   * @param {Object} options Session management options
   * @param {MonitorOptions} options.monitor Session activity monitor options, passed to
   * @param {SessionOptions} options.session Session options
   * @param {StorageOptions} options.storage Session storage options
   */
  constructor(options = {}) {
    this.options = options;

    this.#storage = new Storage(options.storage);

    this.loadStoredSession();
    this.startMonitoring();
  }

  get session() {
    if (this.#session.hasExpired) {
      this.startNewSession();
    }
    return this.#session;
  }

  set session(session) {
    this.#session = Vue.observable(session);
  }

  loadStoredSession() {
    this.session = new Session(this.#storage.data, this.options.session);
  }

  startNewSession() {
    this.#storage.empty();
    this.session = new Session(null, this.options.session);
    this.store();
  }

  startMonitoring() {
    this.#monitor = new Monitor((event) => this.touch(event), this.options.monitor);
  }

  stopMonitoring() {
    this.#monitor.stop();
  }

  store() {
    this.#storage.data = {
      id: this.session.id,
      activatedAt: this.session.activatedAt,
      activatedBy: this.session.activatedBy,
      timestamp: this.session.timestamp
    };
  }

  touch(event) {
    this.session.touch(event);
    this.store();
  }
}
