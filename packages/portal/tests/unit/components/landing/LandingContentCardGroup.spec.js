import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingContentCardGroup from '@/components/landing/LandingContentCardGroup.vue';

const localVue = createLocalVue();

const testPropsData = {
  section: {
    headline: 'This is a headline',
    hasPartCollection: { items: [] }
  }
};

const testPropsDataWithProfile = {
  section: {
    ...testPropsData.section,
    profile: {
      background: 'alternate'
    }
  }
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

    expect(cardGroup.classes().includes('pro')).toBe(true);
  });

  describe('when there is a background set in the profile', () => {
    it('adds a class to style the card group', () => {
      const wrapper = factory(testPropsDataWithProfile);

      const cardGroup = wrapper.find('[data-qa="landing content card group"]');

      expect(cardGroup.classes().includes('bg-color-alternate')).toBe(true);
    });
  });
});
