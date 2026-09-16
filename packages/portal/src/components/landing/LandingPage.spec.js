import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingPage from '@/components/landing/LandingPage.vue';

const localVue = createLocalVue();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(LandingPage, {
  localVue,
  propsData: {
    headline: 'Test',
    ...propsData
  },
  mocks: {
    $t: (key) => key,
    $route: { params: {} },
    ...mocks
  },
  stubs: ['b-container', 'b-col', 'LandingImageCard', 'LandingHero']
});

describe('components/landing/LandingPage', () => {
  const typeName = 'InfoCardGroup';
  const sections = [{ __typename: typeName }];
  const propsData = { headline: 'This page is awesome', sections };

  it('renders the landing page', () => {
    const wrapper = factory({ propsData });

    const landingPage = wrapper.find('[data-qa="landing page"]');

    expect(landingPage.isVisible()).toBe(true);
  });

  it('derives section IDs from their English name', () => {
    const propsData = {
      headline: 'This page is awesome',
      sections: [
        { __typename: 'ImageCard', nameEN: 'about us' }
      ]
    };
    const wrapper = factory({ propsData });

    const aboutUs = wrapper.find('#about-us');

    expect(aboutUs.exists()).toBe(true);
  });

  describe('sectionsWithClasses', () => {
    it('returns an empty array when no sections are provided', () => {
      const wrapper = factory({ propsData: { sections: [] } });

      expect(wrapper.vm.sectionsWithClasses).toEqual([]);
    });

    it('adds wrapper class for ImageCard sections', () => {
      const sections = [
        { __typename: 'ImageCard' }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[0].classes).toContain(
        'image-card-container-wrapper'
      );
    });

    it('adds background class when section has profile background', () => {
      const sections = [
        { profile: { background: 'highlight' } }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[0].classes).toContain(
        'bg-color-highlight'
      );
    });

    it('adds background class when section has image profile background', () => {
      const sections = [
        { image: { profile: { background: 'alternate'  } } }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[0].classes).toContain(
        'bg-color-alternate'
      );
    });

    it('does not add highlight background to ImageCardGroup sections', () => {
      const sections = [
        {
          __typename: 'ImageCardGroup',
          image: { profile: { background: 'highlight' } }
        }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[0].classes).not.toContain(
        'bg-color-highlight'
      );
    });

    it('does not add alternate background to first LandingSubSection', () => {
      const sections = [
        { __typename: 'LandingSubSection' }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[0].classes).not.toContain(
        'bg-color-alternate'
      );
    });

    it('adds alternate background when previous section has no background', () => {
      const sections = [
        {},
        { __typename: 'LandingSubSection' }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[1].classes).toContain(
        'bg-color-alternate'
      );
    });

    it('does not add alternate background when previous section already has a background', () => {
      const sections = [
        { image: { profile: { background: 'alternate' } } },
        { __typename: 'LandingSubSection' }
      ];

      const wrapper = factory({ propsData: { sections } });

      expect(wrapper.vm.sectionsWithClasses[1].classes).not.toContain(
        'bg-color-alternate'
      );
    });

    it('inherits background style for subsequent CardGroup sections', () => {
      const sections = [
        {},
        {
          __typename: 'CardGroup'
        },
        {
          __typename: 'CardGroup'
        }
      ];

      const wrapper = factory({ propsData: { sections } });

      const first = wrapper.vm.sectionsWithClasses[1];
      const second = wrapper.vm.sectionsWithClasses[2];

      expect(first.classes).toContain('bg-color-alternate');
      expect(second.classes).toContain('bg-color-alternate');
    });
  });
});
