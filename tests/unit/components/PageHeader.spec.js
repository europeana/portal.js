import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageHeader from '@/components/PageHeader.vue';
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
  stubs: { transition: true },
  store: options.store || store({ showSearchBar: options.showSearch || false })
});

const store = (searchState = {}) => {
  return new Vuex.Store({
    state: {
      search: searchState
    },
    mutations: {
      'search/setShowFiltersSheet': () => null
    }
  });
};

describe('components/PageHeader', () => {
  it('contains a search form', () => {
    const wrapper = factory({ showSearch: true });

    const form = wrapper.find('[data-qa="search form"]');
    expect(form.isVisible());
  });

  it('contains the logo', () => {
    const wrapper = factory();
    const logo = wrapper.find('[data-qa="logo"]');
    expect(logo.attributes().src).toMatch(/\/logo\.svg$/);
  });

  it('contains the top nav', () => {
    const wrapper = factory();

    const nav = wrapper.find('[data-qa="top navigation"]');
    expect(nav.isVisible());
  });

  it('contains the sidebar hamburger button', () => {
    const wrapper = factory();

    const sidebarButton = wrapper.find('b-button-stub.navbar-toggle');
    expect(sidebarButton.isVisible());
  });

  it('shows the sidebar when the sidebar is set to visible', () => {
    const wrapper = factory();

    const nav = wrapper.find('[data-qa="sidebar navigation"]');
    expect(nav.isVisible());
  });
});
