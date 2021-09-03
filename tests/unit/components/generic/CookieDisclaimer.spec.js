import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import CookieDisclaimer from '@/components/generic/CookieDisclaimer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (setBannerHeightSpy) => shallowMount(CookieDisclaimer, {
  localVue,
  methods: { setBannerHeight: setBannerHeightSpy || sinon.spy() },
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
