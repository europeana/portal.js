import Vue from 'vue';
// import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { VueMasonryPlugin } from 'vue-masonry';
// import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
// Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(VueMasonryPlugin);
// Vue.use(VueRouter);
Vue.directive('visible-on-scroll', () => {});

Vue.prototype.$path = () => {
  return '/';
};
Vue.prototype.$route = () => ({}),
Vue.prototype.$link = {
  to: route => route,
  href: () => null
};
Vue.prototype.$store = {
  state: {
    auth: { loggedIn: false },
    entity: { pinned: [] },
    search: {
      liveQueries: [],
      showSearchBar: false,
      allThemes: []
    },
    set: { liked: [] }
  },
  getters: {
    'entity/isPinned': () => {},
    'search/formatFacetFieldLabel': (name, value) => value,
    'set/isLiked': () => {}
  },
  mutations: {
    'search/setShowSearchBar': (state, value) => state.search.showSearchBar = value
  },
  commit: () => {},
  dispatch: () => {}
};
Vue.prototype.$auth = { $storage: { setUniversal: () => {} }, loginWith: () => {} };
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
