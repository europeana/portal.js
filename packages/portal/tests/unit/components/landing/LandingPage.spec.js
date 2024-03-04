import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingPage from '@/components/landing/LandingPage.vue';

const localVue = createLocalVue();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(LandingPage, {
  localVue,
  propsData,
  mocks: {
    $route: { params: {} },
    ...mocks
  },
  stubs: ['b-container', 'b-col']
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

  describe('variant', () => {
    it('defaults to pro variant', () => {
      const wrapper = factory({ propsData });

      const landingPage = wrapper.find('[data-qa="landing page"]');

      expect(landingPage.classes().includes('pro-page')).toBe(true);
    });

    it('detects ds4ch variant from route', () => {
      const $route = { params: { pathMatch: 'microsite/DS4CH.eu' } };
      const wrapper = factory({ mocks: { $route }, propsData });

      const landingPage = wrapper.find('[data-qa="landing page"]');

      expect(landingPage.classes().includes('ds4ch-page')).toBe(true);
    });
  });
});
