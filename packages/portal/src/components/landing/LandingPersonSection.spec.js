import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingPersonSection from '@/components/landing/LandingPersonSection.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingPersonSection, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingPersonSection', () => {
  it('displays the person section', () => {
    const wrapper = factory({ section: { '__typename': 'PersonGroup', hasPartCollection: { items: [] } } });

    const stubedSection = wrapper.find('.person-section-container');

    expect(stubedSection.exists()).toBe(true);
  });
});
