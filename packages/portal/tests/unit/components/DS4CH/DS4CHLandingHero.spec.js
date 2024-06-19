import { createLocalVue, shallowMount } from '@vue/test-utils';

import DS4CHLandingHero from '@/components/DS4CH/DS4CHLandingHero.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(DS4CHLandingHero, {
  localVue,
  propsData,
  mocks: {
    $t: () => {}
  },
  stubs: ['b-container']
});

describe('components//DS4CH/DS4CHLandingHero.vue', () => {
  describe('imageCSSVars', () => {
    describe('when there is a hero image available', () => {
      it('returns background style definitions', () => {
        const wrapper = factory({
          headline: 'This page is awesome',
          heroImage: { image: { url: 'https://www.europeana.eu/example.jpg' } }
        });

        expect(wrapper.vm.imageCSSVars).toBeTruthy();
      });
    });
  });
});
