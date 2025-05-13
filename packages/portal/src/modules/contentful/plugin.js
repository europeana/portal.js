import assets from './assets';
import query from './query';

const MODULE_NAME = 'contentful';

export default ({ $config, $apm }, inject) => {
  const plugin = {
    assets: assets(),
    query: query({ $apm, $config })
  };

  inject(MODULE_NAME, plugin);
};
