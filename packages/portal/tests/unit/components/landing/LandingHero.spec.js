import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingHero from '@/components/landing/LandingHero.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingHero, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveContentfulImageSrcset: (img, sizes) => Object.keys(sizes).join(',')
      }
    }
  },
  stubs: ['b-container']
});

describe('components/landing/LandingHero', () => {
  describe('imageSrcset', () => {
    describe('when there is a hero image available', () => {
      it('returns background style definitions', () => {
        const wrapper = factory({ headline: 'This page is awesome',
          heroImage: { image: { url: 'https://www.europeana.eu/example.jpg', width: 100, height: 100 } } });

        expect(wrapper.vm.imageSrcset).toBeTruthy();
      });
    });
  });
});
