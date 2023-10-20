import SessionManager from './manager.js';

const instanceProperty = '$session';

const VueSession = {
  install(Vue, options = {}) {
    if (!Object.hasOwn(Vue.prototype, instanceProperty)) {
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
