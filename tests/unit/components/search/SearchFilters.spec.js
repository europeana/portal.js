import { createLocalVue, shallowMount } from '@vue/test-utils';

import SearchFilters from '@/components/search/SearchFilters.vue';

const localVue = createLocalVue();

const factory = (options = {}) => {
  return shallowMount(SearchFilters, {
    localVue,
    stubs: ['b-badge'],
    mocks: {
      $features: {
        sideFilters: false
      }
    },
    ...options
  });
};

describe('components/search/SearchFilters', () => {
  it('shows a badge for each supplied filter', () => {
    const wrapper = factory({
      propsData: { filters: { TYPE: ['IMAGE', 'VIDEO'] } }
    });

    const badges = wrapper.findAll('[data-qa="filter badge"]');
    expect(badges.length).toBe(2);
  });

  describe('labels', () => {
    it('by default does not prefix with facet name', () => {
      const wrapper = factory({
        propsData: { filters: { TYPE: ['IMAGE'] } }
      });

      const label = wrapper.find('[facetname="TYPE"]');

      expect(label.props('prefixed')).toBe(false);
    });

    it('will optionally prefix all with facet name', () => {
      const wrapper = factory({
        propsData: {
          filters: { contentTier: ['*'], TYPE: ['IMAGE'] },
          prefix: true
        }
      });

      const typeLabel = wrapper.find('[facetname="TYPE"]');
      const contentTierLabel = wrapper.find('[facetname="contentTier"]');

      expect(typeLabel.props('prefixed')).toBe(true);
      expect(contentTierLabel.props('prefixed')).toBe(true);
    });

    it('will optionally prefix  with facet name based on a function', () => {
      const wrapper = factory({
        propsData: {
          filters: { contentTier: ['*'], TYPE: ['IMAGE'] },
          prefix: (name) => name !== 'contentTier'
        }
      });

      const typeLabel = wrapper.find('[facetname="TYPE"]');
      const contentTierLabel = wrapper.find('[facetname="contentTier"]');

      expect(typeLabel.props('prefixed')).toBe(true);
      expect(contentTierLabel.props('prefixed')).toBe(false);
    });
  });
});
