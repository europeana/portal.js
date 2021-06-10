import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import CookieDisclaimer from '../../../../src/components/generic/CookieDisclaimer.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const store = new Vuex.Store({
  state: {
    bannerVisible: false
  },
  mutations: {
    setVisibility(state, value) {
      state.bannerVisible = value;
    }
  }
});

const factory = (setBannerHeightSpy) => shallowMount(CookieDisclaimer, {
  localVue,
  methods: { setBannerHeight: setBannerHeightSpy || sinon.spy() },
  store,
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/CookieDisclaimer', () => {
  it('calls `setBannerHeight` method when browser has been resized', () => {
    const setBannerHeight = sinon.spy();
    factory(setBannerHeight);

    global.window.dispatchEvent(new Event('resize'));

    setBannerHeight.should.have.callCount(2);
  });
});
