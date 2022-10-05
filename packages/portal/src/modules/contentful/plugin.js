import assets from './assets';
import query from './query';

import storeModule from './store';

const MODULE_NAME = 'contentful';

export default async({ $config, $apm, store }, inject) => {
  if (store) {
    store.registerModule(MODULE_NAME, storeModule);
  }

  const plugin = {
    assets: assets({ store }),
    query: await query({ $apm, $config })
  };

  inject(MODULE_NAME, plugin);
};
