import ServiceManager from './manager.js';

const instanceProperty = '$serviceManager';

const VueServiceManager = {
  install(Vue, options = {}) {
    if (!Object.prototype.hasOwnProperty.call(Vue.prototype, instanceProperty)) {
      const manager = new ServiceManager(options);
      manager.loadSelections();
      manager.initSelections();

      Object.defineProperty(Vue.prototype, instanceProperty, {
        get() {
          return manager;
        }
      });
    }
  }
};

export default VueServiceManager;
