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
    return { swiperReady: null };
  },
  mocks: {
    $t: key => key
  }
});

describe('mixins/swiper', () => {
  describe('when swiper package is available', () => {
    it('initialises new swiper', () => {
      const wrapper = factory();
      expect(wrapper.vm.swiper.el).toEqual('.swiper');
    });
  });
  describe('swiperOnAfterInit()', () => {
    it('sets swiperReady to true', () => {
      const wrapper = factory();

      wrapper.vm.swiperOnAfterInit();

      expect(wrapper.vm.swiperReady).toBe(true);
    });
  });
});
