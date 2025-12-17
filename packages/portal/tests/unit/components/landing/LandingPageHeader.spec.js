import { createLocalVue, shallowMount } from '@vue/test-utils';
import LandingPageHeader from '@/components/landing/LandingPageHeader.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (mocks) => shallowMount(LandingPageHeader, {
  localVue,
  mocks: {
    $route: {},
    $t: (key) => key,
    ...mocks
  }
});

describe('components/landing/LandingPageHeader', () => {
  describe('when on the apis page', () => {
    it('contains the top navigation', () => {
      const wrapper = factory({ $route: { params: { pathMatch: 'apis' }, query: {} } });

      const topNav = wrapper.find('[data-qa="top navigation"]');

      expect(topNav.exists()).toBe(true);
    });
  });
  describe('when on the black history month page', () => {
    it('does not contain the top navigation', () => {
      const wrapper = factory({ $route: { params: { pathMatch: 'bhm' }, query: {} } });

      const topNav = wrapper.find('[data-qa="top navigation"]');

      expect(topNav.exists()).toBe(false);
    });
    it('does contain a logo', () => {
      const wrapper = factory({ $route: { params: { pathMatch: 'bhm' }, query: {} } });

      const topNav = wrapper.find('.logo');

      expect(topNav.exists()).toBe(true);
    });
  });
});
