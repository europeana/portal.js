import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import SmartLink from '@/components/generic/SmartLink.vue';
import PageFooter from '@/components/PageFooter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);
localVue.component('SmartLink', SmartLink);

const store = new Vuex.Store({
  state() {
    return {
      settings: {},
      axiosLogger: {
        requests: []
      }
    };
  },
  mutations: {
    applySettings(state, settings) {
      state.settings = settings;
    }
  },
  getters: {
    'debug/settings': (state) => state.settings
  }
});

const factory = () => shallowMount(PageFooter, {
  localVue,
  store,
  mocks: {
    $t: (key) => key
  }
});

describe('components/PageFooter', () => {
  it('contains the language selector', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      enableLanguageSelector: true
    });
    const selector = wrapper.find('[data-qa="language selector"]');

    expect(selector.isVisible()).toBe(true);
  });
  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links = wrapper.vm.footerMoreInfo.links;

    expect(links.some(link => link.text === 'footer.navigation.about')).toBe(true);
  });

  describe('debug menu', () => {
    it('is not shown by default', () => {
      const wrapper = factory();

      expect(wrapper.vm.showDebugMenu).toBe(false);
    });

    it('is shown if enabled in debug settings', () => {
      const wrapper = factory();

      store.commit('applySettings', { apiRequests: true });

      expect(wrapper.vm.showDebugMenu).toBe(true);
    });
  });
});
