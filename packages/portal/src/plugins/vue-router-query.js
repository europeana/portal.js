import Vue from 'vue';
import VueRouterQuery from '@europeana/vue-router-query';

export default ({ app }) => {
  Vue.use(VueRouterQuery, { router: app.router });
};
