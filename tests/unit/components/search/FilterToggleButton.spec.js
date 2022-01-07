
import { createLocalVue, shallowMount } from '@vue/test-utils';
import FilterToggleButton from '@/components/search/FilterToggleButton.vue';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMount(FilterToggleButton, {
  localVue,
  mocks: {
    $t: (key) => key
  },
  store: store({ showFiltersToggle: options.showFiltersToggle || false })
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

describe('components/search/FilterToggleButton', () => {
  describe('when no side filters are on the page', () => {
    describe('the filter toggle button', () => {
      it('should not exist', () => {
        const wrapper = factory({ showFiltersToggle: false });

        const filterButton = wrapper.find('[data-qa="search filter button"]');
        expect(filterButton.exists()).toBe(true);
      });
    });
  });
  describe('when side filters are on the page', () => {
    describe('the filter toggle button', () => {
      it('should exist', () => {
        const wrapper = factory({ showFiltersToggle: true });

        const filterButton = wrapper.find('[data-qa="search filter button"]');
        expect(filterButton.exists()).toBe(true);
      });
    });
  });
});
