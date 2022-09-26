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
    ...mocks
  }
});

describe('components/search/FilterToggleButton', () => {
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
