import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageHeader from '../../../src/components/PageHeader.vue';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.directive('visible-on-scroll', () => { });

const factory = (options = {}) => shallowMount(PageHeader, {
  localVue,
  mocks: {
    $t: (key) => {
      return `TRANSLATED: ${key}`;
    },
    $path: (code) => window.location.href + code
  },
  stubs: {
    transition: true
  },
  store: options.store || store({ showSearchBar: options.showSearch || false })
});

const store = (searchState = {}) => {
  return new Vuex.Store({
    state: {
      search: searchState
    }
  });
};

describe('components/PageHeader', () => {
  it('contains a search form', () => {
    const wrapper = factory({ showSearch: true });

    const form = wrapper.find('[data-qa="search form"]');
    form.isVisible().should.equal(true);
  });

  it('contains the logo', () => {
    const wrapper = factory();
    const logo = wrapper.find('[data-qa="logo"]');
    logo.attributes().src.should.match(/\/logo\..+\.svg$/);
  });

  it('contains the top nav', () => {
    const wrapper = factory();

    const nav = wrapper.find('[data-qa="top navigation"]');
    nav.isVisible().should.equal(true);
  });

  it('contains the sidebar hamburger button', () => {
    const wrapper = factory();

    const sidebarButton = wrapper.find('b-button-stub.navbar-toggle');
    sidebarButton.isVisible().should.equal(true);
  });

  it('shows the sidebar when the sidebar is set to visible', () => {
    const wrapper = factory();

    const nav = wrapper.find('[data-qa="sidebar navigation"]');
    nav.isVisible().should.equal(true);
  });
});
