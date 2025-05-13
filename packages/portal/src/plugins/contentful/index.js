import assets from './assets.js';

const MODULE_NAME = 'contentful';

export default ({ $config, $apm }, inject) => {
  const plugin = {
    assets: assets()
  };

  inject(MODULE_NAME, plugin);
};
