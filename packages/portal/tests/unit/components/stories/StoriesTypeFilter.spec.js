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
  stubs: ['b-dropdown', 'b-dropdown-item']
});

describe('StoriesTypeFilter', () => {
  it('sets the correct initial data', () => {
    const wrapper = factory();
    expect(wrapper.vm.selectedStoryType).toBe(wrapper.vm.storyTypes[0]);
  });

  describe('when type story is selected in route query', () => {
    it('updates the selectedStoryType to the story type', () => {
      const wrapper = factory({ type: 'story' });

      expect(wrapper.vm.selectedStoryType.query).toBe('story');
    });
  });

  describe('when type exhibition is selected in route query', () => {
    it('updates the selectedStoryType to the exhibition type', () => {
      const wrapper = factory({ type: 'exhibition' });

      expect(wrapper.vm.selectedStoryType.query).toBe('exhibition');
    });
  });
});
