import Vue from 'vue';
// import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
// import { VueMasonryPlugin } from 'vue-masonry';
// import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
// Vue.use(Vuex);
Vue.use(BootstrapVue);
// Vue.use(VueMasonryPlugin);
// Vue.use(VueRouter);

Vue.prototype.$path = function() {
  return '/';
};
Vue.prototype.$store = {
  dispatch: () => {},
  getters: {
    'search/formatFacetFieldLabel': (name, value) => value
  }
};
Vue.prototype.$fetchState = {};

// TODO: properly import store modules needed for components that use them
// const store = new Vuex.Store({
//   getters: {
//     'debug/settings': state => {
//       return {}
//     }
//   }
// })

import messages from '@/lang/en';
import '@/plugins/vue-filters';
import '@/plugins/vue/index.js';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    i18n,
    render(createElement) {
      return createElement(previewComponent);
    }
  };
};
