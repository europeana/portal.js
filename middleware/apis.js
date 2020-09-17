import apis from '../plugins/europeana';

export default ({ store }) => {
  for (const api in store.state.apis.urls) {
    if (store.state.apis.urls[api]) apis[api].url = store.state.apis.urls[api];
  }
};
