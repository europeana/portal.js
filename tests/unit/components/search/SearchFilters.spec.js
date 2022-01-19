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
    describe('when side filters are enabled', () => {
      it('is not prefixed', () => {
        const wrapper = factory({
          propsData: { filters: { TYPE: ['IMAGE'] } },
          mocks: { $features: { sideFilters: true } }
        });

        const label = wrapper.find('[facetname="TYPE"]');

        expect(label.props('prefixed')).toBe(false);
      });
    });

    describe('when facet name is contentTier', () => {
      it('is not prefixed', () => {
        const wrapper = factory({
          propsData: { filters: { contentTier: ['*'] } }
        });

        const label = wrapper.find('[facetname="contentTier"]');

        expect(label.props('prefixed')).toBe(false);
      });
    });

    describe('when facet name is not contentTier', () => {
      it('is prefixed', () => {
        const wrapper = factory({
          propsData: { filters: { TYPE: ['IMAGE'] } }
        });

        const label = wrapper.find('[facetname="TYPE"]');

        expect(label.props('prefixed')).toBe(true);
      });
    });
  });
});
