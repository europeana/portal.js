import { createLocalVue, shallowMount } from '@vue/test-utils';

import StaticPage from '@/components/static/StaticPage.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(StaticPage, {
  localVue,
  propsData,
  stubs: ['b-container', 'b-row', 'b-col', 'StaticAutomatedTranslationLabel']
});

describe('components/static/StaticPage', () => {
  describe('when the page content uses automated translations', () => {
    it('displays the automated translation label', () => {
      const wrapper = factory({ name: 'Static example page', automatedTranslation: true });

      const label = wrapper.find('staticautomatedtranslationlabel-stub');

      expect(label.exists()).toBe(true);
    });
  });
});
