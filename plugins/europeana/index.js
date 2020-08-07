export let config;

export default ({ store }) => {
  if (store && store.getters['apis/config']) config = store.getters['apis/config'];
};
