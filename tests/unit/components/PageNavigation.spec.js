import { createLocalVue, shallowMount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';
import PageNavigation from '../../../src/components/PageNavigation.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(PageNavigation, {
  localVue,
  mocks: {
    $store: { state: { auth: { loggedIn: false } } },
    $t: (key) => key,
    $path: code => window.location.href + code,
    $route: { fullPath: '/fr' },
    localePath: path => path
  }
});

describe('components/PageNavigation', () => {
  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links = wrapper.find('[data-qa="main navigation"]');

    links.html().includes('header.navigation.collections').should.be.true;
  });
});
