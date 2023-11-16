import { createLocalVue, shallowMount } from '@vue/test-utils';

import HomeLatestGalleries from '@/components/home/HomeLatestGalleries.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(HomeLatestGalleries, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/home/HomeLatestGalleries', () => {
  describe('moreButton', () => {
    it('contains link text', () => {
      const wrapper = factory();

      const moreButtonData = wrapper.vm.moreButton;

      expect(moreButtonData.text).toEqual('galleries.seeAllPublished');
    });
  });
});
