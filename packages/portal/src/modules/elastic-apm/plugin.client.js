import Vue from 'vue';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import VueSessionId from '@europeana/vue-session-id';
import { apm } from '@elastic/apm-rum';
import { routeHooks } from './utils';

export default ({ app, $config }, inject) => {
  const config = $config?.elastic?.apm || {};

  if (!config.serverUrl) {
    return;
  }

  Vue.use(ApmVuePlugin, { config });
  Vue.use(VueSessionId, { prefix: 'apm.' });

  if (apm.isActive()) {
    routeHooks(app.router, apm, { localeCodes: app.i18n?.localeCodes });
  }

  inject('apm', apm);
};
