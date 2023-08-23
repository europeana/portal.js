import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';

import LandingHero from '@/components/landing/LandingHero.vue';

const localVue = createLocalVue();
localVue.use(VueI18n);

const factory = (propsData) => shallowMount(LandingHero, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    },
    $t: () => {}
  }
});

describe('components/landing/LandingHero', () => {
  describe('imageCSSVars', () => {
    describe('when there is a hero image available', () => {
      it('returns background style definitions', () => {
        const wrapper = factory({ title: 'This page is awesome',
          heroImage: { image: { url: 'https://www.europeana.eu/example.jpg' } } });

        expect(wrapper.vm.imageCSSVars).toBeTruthy();
      });
    });
  });
});
