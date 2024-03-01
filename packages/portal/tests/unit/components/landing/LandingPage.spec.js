import { createLocalVue, shallowMount } from '@vue/test-utils';

import LandingPage from '@/components/landing/LandingPage.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(LandingPage, {
  localVue,
  propsData,
  mocks: {
    $route: { params: {} }
  },
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingPage', () => {
  it('renders the landing page', () => {
    const typeName = 'InfoCardGroup';
    const sections = [{ __typename: typeName }];
    const wrapper = factory({ headline: 'This page is awesome', sections });

    const landingPage = wrapper.find('[data-qa="landing page"]');

    expect(landingPage.isVisible()).toBe(true);
  });
});
