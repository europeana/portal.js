import { createLocalVue, shallowMount } from '@vue/test-utils';

import StoryHero from '@/components/story/StoryHero.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(StoryHero, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    },
    $t: () => {}
  },
  stubs: ['b-container', 'b-col']
});

describe('components/story/StoryHero', () => {
  describe('when there is a background image available', () => {
    it('returns background style definitions', () => {
      const wrapper = factory({ title: 'This is a title',
        hero: { image: { url: 'https://www.europeana.eu/example.jpg' } } });

      expect(wrapper.vm.imageCSSVars).toBeTruthy();
    });
  });
});
