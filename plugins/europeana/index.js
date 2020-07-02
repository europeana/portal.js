import defaultConfig from '../../modules/apis/defaults';

export let config = defaultConfig;

export default ({ store }) => {
  if (store && store.getters['apis/config']) config = store.getters['apis/config'];
};
