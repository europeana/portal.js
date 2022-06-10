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
  // FIXME: test swiper initialisation
  // describe('when swiper package is available', () => {
  //   it('initialises new swiper', () => {
  //     const wrapper = factory();

  //     expect(wrapper.vm.swiper).toEqual(swiperMock);
  //   });
  // });
  describe('onAfterInit()', () => {
    it('sets ready to true', () => {
      const wrapper = factory();

      wrapper.vm.onAfterInit();

      expect(wrapper.vm.ready).toEqual(true);
    });
  });
});
