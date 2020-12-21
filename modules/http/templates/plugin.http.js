import { currentProtocol, currentHost, isHttps, requestOrigin } from './utils';

import storeModule from './store';

const plugin = {
  currentHost,
  currentProtocol,
  isHttps,
  requestOrigin
};

export default ({ store }, inject) => {
  inject('http', plugin);

  if (store) store.registerModule('http', storeModule);
};
