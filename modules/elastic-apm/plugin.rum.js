import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import Vue from 'vue';

import options from './options';

export default ({ app }) => {
  Vue.use(ApmVuePlugin, {
    config: options,
    router: app.router
  });
};
