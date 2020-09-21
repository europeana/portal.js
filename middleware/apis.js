import apiConfig from '../plugins/europeana';

export default ({ store }) => {
  for (const api in store.state.apis.urls) {
    if (store.state.apis.urls[api]) apiConfig[api].url = store.state.apis.urls[api];
  }
};
