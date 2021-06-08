import Vue from 'vue';
import VueMatomo from 'vue-matomo';

export default ({ app, $config: { matomo: { host, siteId } } }) => {
  if (!host || !siteId) {
    return;
  }

  Vue.use(VueMatomo, {
    // Docs: https://github.com/AmazingDreams/vue-matomo#readme
    router: app.router,
    host,
    siteId
  });
};
