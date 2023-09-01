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
      const wrapper = factory({ title: 'Embed this' });

      const containerId = wrapper.find('.landing-embed').attributes('id');

      expect(containerId).toBe('embed-this');
    });
  });

  describe('computed', () => {
    describe('imageCSSVars', () => {
      describe('when there is a background image available', () => {
        it('returns background style definitions', () => {
          const wrapper = factory({ backgroundImage: { image: { url: 'https://www.europeana.eu/example.jpg' } } });

          expect(wrapper.vm.imageCSSVars).toBeTruthy();
        });
      });
    });
  });
});
