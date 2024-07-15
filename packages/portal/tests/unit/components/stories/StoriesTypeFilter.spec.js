import { createLocalVue, shallowMount } from '@vue/test-utils';
import StoriesTypeFilter from '@/components/stories/StoriesTypeFilter.vue';

const localVue = createLocalVue();

const factory = (query = {}) => shallowMount(StoriesTypeFilter, {
  localVue,
  mocks: {
    $route: {
      query
    },
    $t: (key) => key
  },
  stubs: ['b-nav', 'b-nav-item', 'b-nav-item-dropdown', 'b-dropdown-item']
});

describe('StoriesTypeFilter', () => {
  describe('activeType', () => {
    describe('when an invalid type is selected', () => {
      it('defaults to view all', () => {
        const wrapper = factory({ type: 'invalid' });

        expect(wrapper.vm.activeType.name).toBe('stories.filter.viewAll');
      });
    });
  });

  describe('typeFromRoute', () => {
    it('defaults to undefined', () => {
      const wrapper = factory();

      expect(wrapper.vm.typeFromRoute).toBe(undefined);
    });

    describe('when type story is selected in route query', () => {
      it('updates to the story type', () => {
        const wrapper = factory({ type: 'story' });

        expect(wrapper.vm.typeFromRoute).toBe('story');
      });
    });

    describe('when type exhibition is selected in route query', () => {
      it('updates to the exhibition type', () => {
        const wrapper = factory({ type: 'exhibition' });

        expect(wrapper.vm.typeFromRoute).toBe('exhibition');
      });
    });
  });

  describe('routeForType', () => {
    describe('when on page beyond the first page', () => {
      it('resets the page query', () => {
        const wrapper = factory({ page: 2 });

        const routeForStories = wrapper.vm.routeForType(wrapper.vm.storyTypes[1]);
        expect(routeForStories.query.page).toBe(undefined);
      });
    });
  });
});
