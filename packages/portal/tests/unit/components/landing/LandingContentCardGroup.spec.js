import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingContentCardGroup from '@/components/landing/LandingContentCardGroup.vue';

const localVue = createLocalVue();

const testPropsData = {
  section: {
    headline: 'This is a headline',
    hasPartCollection: { items: [] }
  },
  variant: 'ds4ch'
};

const factory = (propsData = testPropsData) => shallowMount(LandingContentCardGroup, {
  localVue,
  propsData,
  stubs: ['b-container', 'ContentCardSection']
});

describe('components/landing/LandingContentCardGroup', () => {
  it('sets a class based on the variant to style the card group', () => {
    const wrapper = factory();

    const cardGroup = wrapper.find('[data-qa="landing content card group"]');

    expect(cardGroup.classes().includes('ds4ch')).toBe(true);
  });
});
