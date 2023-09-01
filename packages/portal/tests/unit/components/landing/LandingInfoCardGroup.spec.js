import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingInfoCardGroup from '@/components/landing/LandingInfoCardGroup.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingInfoCardGroup, {
  localVue,
  propsData,
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingInfoCardGroup', () => {
  it('displays a title', () => {
    const title = 'Title for an info card group';
    const wrapper = factory({ title });

    const titleElement = wrapper.find('h2');

    expect(titleElement.text()).toBe(title);
  });
});
