import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingInfoCard from '@/components/landing/LandingInfoCard.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingInfoCard, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingInfoCard', () => {
  it('displays a title', () => {
    const title = 'Title for an info card';
    const wrapper = factory({ card: { name: title } });

    const titleElement = wrapper.find('h3');

    expect(titleElement.text()).toBe(title);
  });
});
