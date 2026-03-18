import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingImageCardGroup from '@/components/landing/LandingImageCardGroup.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingImageCardGroup, {
  localVue,
  propsData,
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingImageCardGroup', () => {
  it('displays a title', () => {
    const title = 'Title for an image card group';
    const wrapper = factory({ title });

    const titleElement = wrapper.find('h2');

    expect(titleElement.text()).toBe(title);
  });
});
