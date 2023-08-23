import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingIllustrationGroup from '@/components/landing/LandingIllustrationGroup.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingIllustrationGroup, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/landing/LandingIllustrationGroup', () => {
  it('displays a title', () => {
    const wrapper = factory({ title: 'Title for an illustration group' });

    const title = wrapper.find('h2');

    expect(title.exists()).toBe(true);
  });
});
