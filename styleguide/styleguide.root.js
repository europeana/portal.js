import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { VueMasonryPlugin } from 'vue-masonry';
// import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(VueMasonryPlugin);
// Vue.use(VueRouter);

Vue.directive('visible-on-scroll', () => {});

Object.assign(Vue.prototype, {
  $apis:
  {
    entity: {
      suggest(query) {
        return Promise.resolve([
          { prefLabel: { en: `suggestion for ${query}` } }
        ]);
      },
      imageUrl: (entity) => entity.image?.url
    }
  },
  $auth: { $storage: { setUniversal: () => {} }, loginWith: () => {} },
  $fetchState: {},
  $link: {
    to: route => route,
    href: () => null
  },
  $path: () => {
    return '/';
  },
  $route: { query: {} }
});

const store = new Vuex.Store({
  modules: {
    auth: {
      state: { loggedIn: false }
    },
    breadcrumb: {
      namespaced: true
    },
    debug: {
      namespaced: true,
      getters: {
        settings: () => {
          return {};
        }
      }
    },
    entity: {
      namespaced: true,
      state: { pinned: [] },
      getters: {
        isPinned: () => {}
      }
    },
    search: {
      namespaced: true,
      state: {
        liveQueries: [],
        showSearchBar: false,
        allThemes: []
      },
      getters: {
        activeView: () => {},
        formatFacetFieldLabel: (name, value) => value
      },
      mutations: {
        setShowSearchBar: (state, value) => state.search.showSearchBar = value
      }
    },
    set: {
      namespaced: true,
      state: { liked: [] },
      getters: {
        isLiked: () => {}
      }
    }
  }
});

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
    store,
    render(createElement) {
      return createElement(previewComponent);
    }
  };
};
