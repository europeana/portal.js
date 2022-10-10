import { currentProtocol, currentHost, isHttps, requestOrigin } from './utils';

import storeModule from './store';

const MODULE_NAME = 'http';

const plugin = {
  currentHost,
  currentProtocol,
  isHttps,
  requestOrigin
};

export default ({ store }, inject) => {
  inject(MODULE_NAME, plugin);

  if (store) {
    store.registerModule(MODULE_NAME, storeModule);
  }
};
