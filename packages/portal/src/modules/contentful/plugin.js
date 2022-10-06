import assets from './assets';
import query from './query';

import storeModule from './store';

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
