import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageHeader from '@/components/page/PageHeader.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.directive('visible-on-scroll', () => { });

const factory = () => shallowMount(PageHeader, {
  localVue,
  mocks: {
    $t: (key) => {
      return `TRANSLATED: ${key}`;
    },
    localePath: (code) => window.location.href + code,
    $route: { query: {} },
    $store: {
      commit(mutation, payload) {
        if (mutation === 'search/setShowSearchBar') {
          this.state.search.showSearchBar = payload;
        }
      },
      state: { search: { showSearchBar: false } }
    }
  },
  stubs: { transition: true }
});

describe('components/PageHeader', () => {
  describe('template', () => {
    describe('search form', () => {
      it('is omitted by default', () => {
        const wrapper = factory();

        const form = wrapper.find('[data-qa="search form wrapper"]');

        expect(form.exists()).toBe(false);
      });

      it('is shown when toggled by the search button', async() => {
        const wrapper = factory();

        const button = wrapper.find('[data-qa="show search button"]');
        await button.trigger('click');

        const form = wrapper.find('[data-qa="search form wrapper"]');

        expect(form.isVisible()).toBe(true);
      });
    });

    it('contains the logo', () => {
      const wrapper = factory();

      const logo = wrapper.find('[data-qa="logo"]');

      expect(logo.attributes().src).toBe('logo.svg');
    });

    it('contains the top nav', () => {
      const wrapper = factory();

      const nav = wrapper.find('[data-qa="top navigation"]');

      expect(nav.isVisible()).toBe(true);
    });

    it('contains the sidebar hamburger button', () => {
      const wrapper = factory();

      const sidebarButton = wrapper.find('b-button-stub.navbar-toggle');

      expect(sidebarButton.isVisible()).toBe(true);
    });

    it('shows the sidebar when the sidebar is set to visible', () => {
      const wrapper = factory();

      const nav = wrapper.find('[data-qa="sidebar navigation"]');

      expect(nav.isVisible()).toBe(true);
    });
  });
});
