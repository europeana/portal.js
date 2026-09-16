import { createLocalVue, shallowMount } from '@vue/test-utils';
import LandingPageHeader from '@/components/landing/LandingPageHeader.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(LandingPageHeader, {
  localVue,
  propsData,
  mocks: {
    $route: {},
    $t: (key) => key,
    ...mocks
  }
});

describe('components/landing/LandingPageHeader', () => {
  it('always renders a logo', () => {
    const wrapper = factory();

    const logo = wrapper.find('.logo');

    expect(logo.isVisible()).toBe(true);
  });

  it('renders supplied navigation links', () => {
    const propsData = { navigationLinks: [{ url: '/about', text: 'About' }] };
    const wrapper = factory({ propsData });

    const topNav = wrapper.find('[data-qa="top navigation"]');

    expect(topNav.isVisible()).toBe(true);
  });

  it('omits rendering navigation links if not supplied', () => {
    const wrapper = factory();

    const topNav = wrapper.find('[data-qa="top navigation"]');

    expect(topNav.exists()).toBe(false);
  });
});
