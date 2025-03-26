import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { VueMasonryPlugin } from 'vue-masonry';
import VueI18n from 'vue-i18n';

import contentfulModuleAssets from '@europeana/portal/src/modules/contentful/templates/assets.js';
import messages from '@europeana/portal/src/i18n/lang/en.js';
import sampleData from '@europeana/portal/docs/sample-data.js';

Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(VueMasonryPlugin);

Vue.mixin({
  data() {
    return sampleData;
  }
});

Vue.directive('visible-on-scroll', () => {});

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
        isPinned: () => (value) => !!value
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
      state: { liked: [], active: { visibility: 'public' } },
      mutations: {
        setActive(state, value) {
          state.active = value;
        }
      },
      actions: {
        publish: ({ state, commit }) => commit('setActive', { ...state.active, visibility: 'published' }),
        unpublish: ({ state, commit }) => commit('setActive', { ...state.active, visibility: 'public' })
      }
    }
  }
});

Object.assign(Vue.prototype, {
  $apis: {
    entity: {
      suggest(query) {
        return Promise.resolve([
          { prefLabel: { en: `suggestion for ${query}` } }
        ]);
      },
      imageUrl: (entity) => entity.isShownBy?.thumbnail || entity.logo
    },
    thumbnail: { edmPreview: (img) => img }
  },
  $auth: { $storage: { setUniversal: () => {} }, loginWith: () => {} },
  $config: {},
  $contentful: {
    assets: contentfulModuleAssets({ store })
  },
  $features: {},
  $fetchState: {},
  $path: () => {
    return '/';
  },
  $route: { query: {},
    params: {
      pathMatch: 'example-page'
    } },
  localePath: () => '/en/localepath',
  switchLocalePath: () => '/'
});

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});
i18n.locales = [
  { code: 'en', name: 'English', iso: 'en-GB' },
  { code: 'de', name: 'Deutsch', iso: 'de-DE' },
  { code: 'nl', name: 'Nederlands', iso: 'nl-NL' }
];

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
