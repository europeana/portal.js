import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import SmartLink from '../../../src/components/generic/SmartLink.vue';
import PageFooter from '../../../src/components/PageFooter.vue';

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
    $t: () => {}
  }
});

describe('components/PageFooter', () => {
  it('contains the language selector', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      enableLanguageSelector: true
    });
    const selector = wrapper.find('[data-qa="language selector"]');

    selector.isVisible().should.equal(true);
  });

  describe('debug menu', () => {
    it('is not shown by default', () => {
      const wrapper = factory();

      wrapper.vm.showDebugMenu.should.be.false;
    });

    it('is shown if enabled in debug settings', () => {
      const wrapper = factory();

      store.commit('applySettings', { apiRequests: true });

      wrapper.vm.showDebugMenu.should.be.true;
    });
  });
});
