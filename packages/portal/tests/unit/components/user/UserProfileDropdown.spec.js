import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import UserProfileDropdown from '@/components/user/UserProfileDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(UserProfileDropdown, {
  localVue,
  mocks: {
    $features: { manageApiKeys: true },
    $keycloak: {
      accountUrl: () => {}
    },
    localePath: (path) => path,
    $t: (key) => key
  }
});

describe('components/user/UserProfileDropdown', () => {
  describe('dropdown toggle button', () => {
    describe('menu closed', () => {
      it('is visible and has an aria label', () => {
        const wrapper = factory();

        const toggleButton = wrapper.find('.dropdown-toggle');

        expect(toggleButton.isVisible()).toBe(true);
        expect(toggleButton.attributes('aria-label')).toEqual('account.menu.open');
      });
    });

    describe('menu opened', () => {
      it('is visible and has an aria label', async() => {
        const wrapper = factory();

        const toggleButton = wrapper.find('.dropdown-toggle');
        wrapper.vm.menuOpen = true;
        await wrapper.vm.$nextTick();

        expect(toggleButton.isVisible()).toBe(true);
        expect(toggleButton.attributes('aria-label')).toEqual('account.menu.close');
      });
    });
  });
});
