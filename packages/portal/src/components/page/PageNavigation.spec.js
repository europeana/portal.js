import { createLocalVue, shallowMount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';
import PageNavigation from '@/components/page/PageNavigation.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PageNavigation, {
  localVue,
  mocks: {
    $features: {},
    $store: { state: { auth: { loggedIn: false } } },
    $t: (key) => key,
    localePath: code => window.location.href + code,
    $route: { fullPath: '/fr' }
  }
});

describe('components/PageNavigation', () => {
  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links = wrapper.find('[data-qa="main navigation"]');

    expect(links.html().includes('header.navigation.collections')).toBe(true);
  });
});
