import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import BootstrapVue from 'bootstrap-vue';
import PageNavigation from '../../../src/components/PageNavigation.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const store = new Vuex.Store({
  modules: {
    i18n: {
      state: {
        locale: 'en'
      }
    },
    auth: {
      loggedIn: false
    }
  }
});

const factory = () => mount(PageNavigation, {
  localVue,
  store,
  mocks: {
    $t: (key) => key,
    $path: code => window.location.href + code,
    $auth: { strategy: { options: {} } },
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    localePath: path => path
  }
});

describe('components/search/PageNavigation', () => {
  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links = wrapper.find('[data-qa="main navigation"]');

    links.contains('Our partners');
  });
});
