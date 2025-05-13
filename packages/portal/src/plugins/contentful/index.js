import assets from './assets.js';
import query from './query.js';

const MODULE_NAME = 'contentful';

export default ({ $config, $apm }, inject) => {
  const plugin = {
    assets: assets(),
    query: query({ $apm, $config })
  };

  inject(MODULE_NAME, plugin);
};
