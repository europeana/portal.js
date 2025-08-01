import { createLocalVue, shallowMount } from '@vue/test-utils';
import DS4CHPageHeader from '@/components/DS4CH/DS4CHPageHeader.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.directive('visible-on-scroll', () => { });

const factory = () => shallowMount(DS4CHPageHeader, {
  localVue,
  mocks: {
    $route: {},
    $t: (key) => key
  }
});

describe('components/DS4CH/DS4CHPageHeader', () => {
  describe('template', () => {
    it('contains the logo', () => {
      const wrapper = factory();

      const logo = wrapper.find('[data-qa="logo"]');

      expect(logo.attributes().src).toBe('logo.svg');
    });

    it('contains the top navigation', () => {
      const wrapper = factory();

      const topNav = wrapper.find('[data-qa="top navigation"]');

      expect(topNav.exists()).toBe(true);
    });
  });
});
