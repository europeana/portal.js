import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import Vue from 'vue';

export default ({ app, $config }) => {
  const config = ($config && $config.elastic ? $config.elastic.apm : undefined) || {};

  if (!config.serverUrl) return;

  Vue.use(ApmVuePlugin, {
    config,
    router: app.router
  });
};
