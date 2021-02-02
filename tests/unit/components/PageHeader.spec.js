import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageHeader from '../../../components/PageHeader.vue';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.directive('visible-on-scroll', () => { });

const factory = (options = {}) => shallowMount(PageHeader, {
  localVue,
  mocks: {
    $t: () => { },
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
      search: searchState,
      'link-group': {
        data: {
          mainNavigation: {
            links: [
              {
                text: 'Collections',
                url: '/collections'
              }
            ]
          },
          mobileNavigation: {
            links: [
              {
                text: 'Our partners',
                url: '/about/our-partners'
              }
            ]
          }
        }
      }
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

  it('contains the desktop nav', () => {
    const wrapper = factory();
    wrapper.setProps({
      mainNavigation: {
        links: [{
          text: 'Collections',
          url: '/collections'
        }]
      }
    });

    const nav = wrapper.find('[data-qa="desktop navigation"]');
    nav.isVisible().should.equal(true);
  });

  it('contains the mobile navigation toggle button', () => {
    const wrapper = factory();

    const sidebarButton = wrapper.find('b-button-stub.navbar-toggle');
    sidebarButton.isVisible().should.equal(true);
  });

  it('shows the mobile nav when the sidebar is visible', () => {
    const wrapper = factory();
    wrapper.setData({
      showSidebar: true
    });
    const nav = wrapper.find('[data-qa="mobile navigation"]');
    nav.attributes().class.should.contain('d-lg-none');
    nav.isVisible().should.equal(true);
  });
});
