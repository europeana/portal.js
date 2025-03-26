import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingHero from '@/components/landing/LandingHero.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingHero, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingHero', () => {
  describe('when there is a hero image available', () => {
    it('displays it as an image with attribution', () => {
      const url = 'https://www.europeana.eu/example.jpg';
      const wrapper = factory({
        headline: 'This page is awesome',
        heroImage: { image: { url, width: 100, height: 100 } }
      });

      const imageWithAttribution = wrapper.find('imagewithattribution-stub');

      expect(imageWithAttribution.attributes('src')).toBe(url);
    });
  });
});
