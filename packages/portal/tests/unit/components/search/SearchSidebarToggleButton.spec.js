import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchSidebarToggleButton from '@/components/search/SearchSidebarToggleButton.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, state = {} } = {}) => shallowMount(SearchSidebarToggleButton, {
  localVue,
  mocks: {
    $route: {
      query: {}
    },
    $store: {
      commit: sinon.spy(),
      state: {
        search: {
          showSearchSidebar: false
        },
        ...state
      }
    },
    $t: (key) => key,
    $features: {},
    ...mocks
  }
});

describe('components/search/SearchSidebarToggleButton', () => {
  describe('when toggle button is clicked', () => {
    it('toggles the display of the search sidebar', () => {
      const wrapper = factory({ state: { search: { showSidebarToggle: true } } });

      const sidebarButton = wrapper.find('[data-qa="search sidebar button"]');
      sidebarButton.trigger('click');

      expect(wrapper.vm.$store.commit.calledWith('search/setShowSearchSidebar', true)).toBe(true);
    });
  });

  describe('template', () => {
    describe('when no search sidebar is on the page', () => {
      describe('the sidebar toggle button', () => {
        it('should not exist', () => {
          const wrapper = factory({ state: { search: { showSidebarToggle: false } } });

          const sidebarButton = wrapper.find('[data-qa="search sidebar button"]');
          expect(sidebarButton.isVisible()).toBe(false);
        });
      });
    });

    describe('when search sidebar is on the page', () => {
      describe('the sidebar toggle button', () => {
        it('should exist', () => {
          const wrapper = factory({ state: { search: { showSidebarToggle: true } } });

          const sidebarButton = wrapper.find('[data-qa="search sidebar button"]');
          expect(sidebarButton.isVisible()).toBe(true);
        });
      });
    });
  });

  describe('computed', () => {
    describe('hasSelectedFilters', () => {
      it('is `false` if route query only includes `query` and `page`', () => {
        const wrapper = factory({ mocks: { $route: { query: { query: 'painting', page: '1' } } } });

        const hasSelectedFilters = wrapper.vm.hasSelectedFilters;

        expect(hasSelectedFilters).toBe(false);
      });

      it('is `true` if route query includes `qf`', () => {
        const wrapper = factory({ mocks: { $route: { query: { qf: 'TYPE:"IMAGE"' } } } });

        const hasSelectedFilters = wrapper.vm.hasSelectedFilters;

        expect(hasSelectedFilters).toBe(true);
      });

      it('is `true` if route query includes `reusability`', () => {
        const wrapper = factory({ mocks: { $route: { query: { reusability: 'open' } } } });

        const hasSelectedFilters = wrapper.vm.hasSelectedFilters;

        expect(hasSelectedFilters).toBe(true);
      });

      it('is `true` if route query includes `api`', () => {
        const wrapper = factory({ mocks: { $route: { query: { api: 'metadata' } } } });

        const hasSelectedFilters = wrapper.vm.hasSelectedFilters;

        expect(hasSelectedFilters).toBe(true);
      });

      it('is `true` if route query includes `qa`', () => {
        const wrapper = factory({ mocks: { $route: { query: { qa: 'proxy_dc_description:blue' } } } });

        const hasSelectedFilters = wrapper.vm.hasSelectedFilters;

        expect(hasSelectedFilters).toBe(true);
      });
    });
  });
});
