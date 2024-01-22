import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingEmbed from '@/components/landing/LandingEmbed.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingEmbed, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    }
  },
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingEmbed', () => {
  describe('template', () => {
    it('has a container ID derived from the title', () => {
      const wrapper = factory({ englishTitle: 'Embed this' });

      const containerId = wrapper.find('.landing-embed').attributes('id');

      expect(containerId).toBe('embed-this');
    });
  });
});
