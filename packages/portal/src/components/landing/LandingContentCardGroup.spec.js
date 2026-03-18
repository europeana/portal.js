import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingContentCardGroup from '@/components/landing/LandingContentCardGroup.vue';

const localVue = createLocalVue();

const testPropsData = {
  section: {
    headline: 'This is a headline',
    hasPartCollection: { items: [] }
  }
};

const factory = (propsData = testPropsData) => shallowMount(LandingContentCardGroup, {
  localVue,
  propsData,
  stubs: ['b-container', 'ContentCardSection']
});

describe('components/landing/LandingContentCardGroup', () => {
  it('renders a landing content card group', () => {
    const wrapper = factory();

    const cardGroup = wrapper.find('[data-qa="landing content card group"]');

    expect(cardGroup.exists()).toBe(true);
  });
});
