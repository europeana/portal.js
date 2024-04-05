import { createLocalVue, shallowMount } from '@vue/test-utils';
import LandingPageHeader from '@/components/landing/LandingPageHeader.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.directive('visible-on-scroll', () => { });

const factory = () => shallowMount(LandingPageHeader, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/landing/LandingPageHeader', () => {
  describe('template', () => {
    it('contains the top navigation', () => {
      const wrapper = factory();

      const topNav = wrapper.find('[data-qa="top navigation"]');

      expect(topNav.exists()).toBe(true);
    });
  });
});
