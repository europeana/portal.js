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
    it('displays the title in a heading', () => {
      const wrapper = factory({ title: 'my embed' });

      const h2 = wrapper.find('h2');

      expect(h2.text()).toBe('my embed');
    });
  });
});
