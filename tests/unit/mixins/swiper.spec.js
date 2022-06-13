import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/swiper';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = () => shallowMount(component, {
  localVue,
  data() {
    return { ready: null };
  }
});

describe('mixins/swiper', () => {
  describe('when swiper package is available', () => {
    class FakeSwiper {
      constructor(element) {
        this.element = element;
      }
    }
    window.Swiper = FakeSwiper;
    it('initialises new swiper', () => {
      const wrapper = factory();
      expect(wrapper.vm.swiper).toEqual({ element: '.swiper' });
    });
  });
  describe('onAfterInit()', () => {
    it('sets ready to true', () => {
      const wrapper = factory();

      wrapper.vm.onAfterInit();

      expect(wrapper.vm.ready).toEqual(true);
    });
  });
});
