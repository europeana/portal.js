import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingInfoCardGroup from '@/components/landing/LandingInfoCardGroup.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingInfoCardGroup, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingInfoCardGroup', () => {
  it('displays a title', () => {
    const wrapper = factory({ title: 'Title for an info card group' });

    const title = wrapper.find('h2');

    expect(title.exists()).toBe(true);
  });
});
