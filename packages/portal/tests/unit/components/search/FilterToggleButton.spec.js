import { createLocalVue, shallowMount } from '@vue/test-utils';
import FilterToggleButton from '@/components/search/FilterToggleButton.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {} } = {}) => shallowMount(FilterToggleButton, {
  localVue,
  mocks: {
    $route: {
      query: {}
    },
    $store: { state: { search: {} } },
    $t: (key) => key,
    $features: {},
    ...mocks
  }
});

describe('components/search/FilterToggleButton', () => {
  describe('template', () => {
    describe('when no side filters are on the page', () => {
      describe('the filter toggle button', () => {
        it('should not exist', () => {
          const wrapper = factory({ mocks: { $store: { state: { search: { showFiltersToggle: false } } } } });

          const filterButton = wrapper.find('[data-qa="search filter button"]');
          expect(filterButton.isVisible()).toBe(false);
        });
      });
    });

    describe('when side filters are on the page', () => {
      describe('the filter toggle button', () => {
        it('should exist', () => {
          const wrapper = factory({ mocks: { $store: { state: { search: { showFiltersToggle: true } } } } });

          const filterButton = wrapper.find('[data-qa="search filter button"]');
          expect(filterButton.isVisible()).toBe(true);
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
