import Vue from 'vue';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import { apm } from '@elastic/apm-rum';
import { routeHooks } from './utils';

export default ({ app, $config }) => {
  const config = ($config && $config.elastic ? $config.elastic.apm : undefined) || {};

  if (!config.serverUrl) {
    return;
  }

  Vue.use(ApmVuePlugin, {
    config
  });

  if (apm.isActive()) {
    routeHooks(app.router, apm, { localeCodes: app.i18n?.localeCodes });
  }
};
