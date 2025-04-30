import assets from './assets.js';
import query from './query.js';
import storeModule from './store.js';

const MODULE_NAME = 'contentful';

export default ({ $config, $apm, store }, inject) => {
  if (store) {
    store.registerModule(MODULE_NAME, storeModule);
  }

  const plugin = {
    assets: assets({ store }),
    query: query({ $apm, $config })
  };

  inject(MODULE_NAME, plugin);
};
