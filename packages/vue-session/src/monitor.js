/**
 * Monitors user activity
 */
export default class Monitor {
  static DEFAULTS = {
    events: ['drag', 'keydown', 'mousedown', 'mousemove', 'scroll', 'touchstart', 'wheel'],
    interval: 60 // in seconds
  };

  /**
   * @typedef {Object} MonitorOptions
   * @property {string[]} events Document events to listen to for activity.
   *   Defaults to `['drag', 'keydown', 'mousedown', 'mousemove', 'scroll', 'touchstart', 'wheel']`.
   * @property {number} interval Number of seconds to pause event listeners
   *   after activity is detected before resuming them. Defaults to 60 seconds.
   */
  /**
   * @param {function} callback Function to call when activity detected
   * @param {MonitorOptions} options Session activity monitor options
   */
  constructor(callback, options = {}) {
    this.callback = callback;

    this.events = options.events ? [].concat(options.events) : this.constructor.DEFAULTS.events;
    this.interval = options.interval || this.constructor.DEFAULTS.interval;

    this.listener = this.#listener.bind(this);

    this.start();
  }

  start() {
    for (const event of this.events) {
      document.addEventListener(event, this.listener);
    }
  }

  stop() {
    for (const event of this.events) {
      document.removeEventListener(event, this.listener);
    }
  }

  pause() {
    this.stop();
    setTimeout(this.start.bind(this), this.interval * 1000);
  }

  #listener(event) {
    this.callback(event);
    this.pause();
  }
}
