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

Vue.prototype.$path = () => {
  return '/';
};
Vue.prototype.$store = {
  state: {
    set: { ...{ liked: [] } },
    entity: { ...{ pinned: [] } }
  },
  getters: {
    'set/isLiked': () => {},
    'entity/isPinned': () => {}
  },
  dispatch: () => {}
};
Vue.prototype.$auth = {};

// TODO: properly import store modules needed for components that use them
/*const store = new Vuex.Store({
  getters: {
    'debug/settings': state => {
      return {}
    }
  }
})*/

import messages from '@/lang/en';
import '@/plugins/vue-filters';

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
