import ServiceManager from './manager.js';

const instanceProperty = '$serviceManager';

const VueServiceManagerPlugin = {
  install(Vue, options = {}) {
    if (!Object.prototype.hasOwnProperty.call(Vue.prototype, instanceProperty)) {
      const manager = Vue.observable(new ServiceManager(options));
      manager.loadSelections();
      manager.initSelections();

      Vue.prototype.$serviceManager = manager;
    }
  }
};

export default VueServiceManagerPlugin;
