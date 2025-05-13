import query from './query.js';

export default ({ $apm, $config }, inject) => {
  const plugin = {
    query: query({ $apm, $config })
  };

  inject('contentful', plugin);
};
