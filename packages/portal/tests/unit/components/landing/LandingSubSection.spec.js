import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingSubSection from '@/components/landing/LandingSubSection.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingSubSection, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingSubSection', () => {
  it('displays a title', () => {
    const title = 'Title for an info card group';
    const wrapper = factory({ title });

    const titleElement = wrapper.find('h2');

    expect(titleElement.text()).toBe(title);
  });
});
