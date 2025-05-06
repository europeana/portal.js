import query from './query';

const MODULE_NAME = 'contentful';

export default ({ $config, $apm }, inject) => {
  const plugin = {
    query: query({ $apm, $config })
  };

  inject(MODULE_NAME, plugin);
};
