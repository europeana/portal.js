import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingInfoCardGroup from '@/components/landing/LandingInfoCardGroup.vue';

const localVue = createLocalVue();

const title = 'Title for an info card group';

const minimalPropsData = { title };

const infoCardsWithLinks = [{}, { link: {} }];

const factory = (propsData = minimalPropsData) => shallowMount(LandingInfoCardGroup, {
  localVue,
  propsData,
  stubs: ['b-container', 'b-col', 'SmartLink', 'LandingInfoCard']
});

describe('components/landing/LandingInfoCardGroup', () => {
  it('displays a title', () => {
    const wrapper = factory();

    const titleElement = wrapper.find('h2');

    expect(titleElement.text()).toBe(title);
  });

  describe('when a title tag is passed', () => {
    it('uses the passed heading tag for correct HTML structure', () => {
      const wrapper = factory({ ...minimalPropsData, titleTag: 'h3' });

      const titleElement = wrapper.find('h3');

      expect(titleElement.text()).toBe(title);
    });
  });

  describe('when any of the cards has a link', () => {
    it('center aligns the group of cards', () => {
      const wrapper = factory({ ...minimalPropsData, infoCards: infoCardsWithLinks });

      const cardWrapperElement = wrapper.find('[data-qa="landing info card group cards wrapper"]');

      expect(cardWrapperElement.classes().includes('justify-content-center')).toBe(true);
    });
    it('passes the column-card prop', () => {
      const wrapper = factory({ ...minimalPropsData, infoCards: infoCardsWithLinks });

      const cardWrapperElement = wrapper.find('landinginfocard-stub');

      expect(cardWrapperElement.attributes('column-card')).toBe('true');
    });
  });
});
