import { createLocalVue, shallowMount } from '@vue/test-utils';

import StaticAutomatedTranslationLabel from '@/components/static/StaticAutomatedTranslationLabel.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(StaticAutomatedTranslationLabel, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/static/StaticAutomatedTranslationLabel', () => {
  it('displays the automated translation label with an icon', () => {
    const wrapper = factory();

    const labelIcon = wrapper.find('.icon-automated');

    expect(labelIcon.exists()).toBe(true);
  });
});
