import SessionManager from './manager.js';

const VueSession = {
  install(Vue, options = {}) {
    const instanceProperty = '$session';
    if (!Object.prototype.hasOwnProperty.call(Vue.prototype, instanceProperty)) {
      const manager = new SessionManager(options);
      Object.defineProperty(Vue.prototype, instanceProperty, {
        get() {
          return manager.session;
        }
      });
    }
  }
};

export default VueSession;
