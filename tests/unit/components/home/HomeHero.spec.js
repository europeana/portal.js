import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';

import HomeHero from '@/components/home/HomeHero.vue';

const localVue = createLocalVue();
localVue.use(VueI18n);

const factory = (propsData) => shallowMount(HomeHero, {
  localVue,
  propsData,
  mocks: {
    $t: () => {}
  }
});

describe('components/home/HomeHero', () => {
  describe('imageCSSVars computed property', () => {
    describe('when there is a background image available', () => {
      it('returns background style definitions', () => {
        const wrapper = factory({ backgroundImage: { image: { url: 'https://www.europeana.eu/example.jpg' } } });

        expect(wrapper.vm.imageCSSVars).toBeTruthy();
      });
    });
  });
});
