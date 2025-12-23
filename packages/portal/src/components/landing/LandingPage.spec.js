import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingPage from '@/components/landing/LandingPage.vue';

const localVue = createLocalVue();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(LandingPage, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $route: { params: {} },
    ...mocks
  },
  stubs: ['b-container', 'b-col', 'LandingImageCard']
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
});
