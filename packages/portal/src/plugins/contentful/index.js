import assets from './assets';
import query from './query';

import storeModule from './store';

const MODULE_NAME = 'contentful';

export default ({ $axios, store }, inject) => {
  if (store) {
    store.registerModule(MODULE_NAME, storeModule);
  }

  const plugin = {
    assets: assets({ store }),
    query: query({ $axios })
  };

  inject(MODULE_NAME, plugin);
};
