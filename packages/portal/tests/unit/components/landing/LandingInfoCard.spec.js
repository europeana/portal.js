import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingInfoCard from '@/components/landing/LandingInfoCard.vue';

const localVue = createLocalVue();

const title = 'Title for an info card';

const minimalPropsData = {
  card: {
    name: title
  }
};

const fullPropsData = {
  ...minimalPropsData,
  card: {
    image: { url: 'https://www.example.eu/image.svg', width: 100, height: 100 },
    text: 'text for and info card',
    link: { tetx: 'read more', url: '/' }
  }
};

const factory = (propsData = minimalPropsData) => shallowMount(LandingInfoCard, {
  localVue,
  propsData,
  stubs: ['b-container', 'b-img-lazy', 'SmartLink']
});

describe('components/landing/LandingInfoCard', () => {
  it('displays an image when available', () => {
    const wrapper = factory(fullPropsData);

    const imageElement = wrapper.find('[data-qa="landing info card image"]');

    expect(imageElement.isVisible()).toBe(true);
  });

  it('displays a title', () => {
    const wrapper = factory();

    const titleElement = wrapper.find('h3');

    expect(titleElement.text()).toBe(title);
  });

  it('displays text when available', () => {
    const wrapper = factory(fullPropsData);

    const textElement = wrapper.find('[data-qa="landing info card text"]');

    expect(textElement.isVisible()).toBe(true);
  });

  it('displays a link when available', () => {
    const wrapper = factory(fullPropsData);

    const linkElement = wrapper.find('[data-qa="landing info card link"]');

    expect(linkElement.isVisible()).toBe(true);
  });

  describe('when the centeredContent prop is passed', () => {
    it('displays the card content centered', () => {
      const wrapper = factory({ ...fullPropsData, centeredContent: true });

      const cardElement = wrapper.find('[data-qa="landing info card"]');

      expect(cardElement.classes().includes('flex-column')).toBe(true);
    });
  });
});
