import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import SearchSidebar from '@/components/search/SearchSidebar.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => {
  return shallowMountNuxt(SearchSidebar, {
    localVue,
    attachTo: document.body,
    mocks: {
      $t: (key) => key,
      $route: { query: {} },
      $store: {
        commit: sinon.spy(),
        state: {
          search: {
            showSearchSidebar: false
          }
        }
      }
    }
  });
};

describe('components/search/SearchSidebar', () => {
  describe('template', () => {
    it('is wrapper in <section role="search">', () => {
      const wrapper = factory();

      const section = wrapper.find('section[role="search"]');

      expect(section.exists()).toBe(true);
    });
  });

  describe('watch', () => {
    describe('showSearchSidebar', () => {
      it('when truthy it does not hide the search sidebar', async() => {
        const wrapper = factory();

        wrapper.vm.$store.state.search.showSearchSidebar = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.hideSearchSidebar).toEqual(false);
      });
      it('otherwise it hides the search sidebar', async() => {
        jest.useFakeTimers();
        const wrapper = factory();

        wrapper.vm.$store.state.search.showSearchSidebar = true;
        await wrapper.vm.$nextTick();
        wrapper.vm.$store.state.search.showSearchSidebar = false;
        await wrapper.vm.$nextTick();
        jest.advanceTimersByTime(300);

        expect(wrapper.vm.hideSearchSidebar).toEqual(true);
      });
    });
  });

  describe('toggleSearchSidebar', () => {
    it('toggles the sidebar display state', () => {
      const wrapper = factory();

      wrapper.vm.toggleSearchSidebar();

      expect(wrapper.vm.$store.commit.calledWith('search/setShowSearchSidebar', true)).toBe(true);
    });
  });

  describe('toggle advanced search', () => {
    describe('when the advanced search toggle is clicked', () => {
      it('toggles the advanced search display state', () => {
        const wrapper = factory();

        const advancedSearchToggle = wrapper.find('[data-qa="toggle advanced search button"]');
        advancedSearchToggle.trigger('click');

        expect(wrapper.emitted('showAdvancedSearch')).toEqual([[true]]);
      });
      it('sets focus on the query builder when shown', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm.$refs.queryBuilder.$el, 'focus');

        const advancedSearchToggle = wrapper.find('[data-qa="toggle advanced search button"]');
        advancedSearchToggle.trigger('click');
        wrapper.setProps({ showAdvancedSearch: true });
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('focusQueryBuilder').length).toBe(1);
        expect(wrapper.vm.$refs.queryBuilder.$el.focus.called).toBe(true);
      });
    });
  });
});
