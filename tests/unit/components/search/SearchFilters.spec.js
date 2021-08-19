import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import SearchFilters from '@/components/search/SearchFilters.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const factory = (filters) => {
  const store = new Vuex.Store({
    modules: {
      search: {
        namespaced: true,
        getters: {
          filters: () => filters
        }
      }
    }
  });

  return shallowMount(SearchFilters, {
    localVue,
    stubs: ['b-badge'],
    store
  });
};

describe('components/search/SearchFilters', () => {
  it('shows a badge for each supplied filter', () => {
    const wrapper = factory({ TYPE: ['IMAGE', 'VIDEO'] });

    const badges = wrapper.findAll('[data-qa="filter badge"]');
    badges.length.should.eq(2);
  });

  describe('labels', () => {
    context('when facet name is contentTier', () => {
      it('is not prefixed', () => {
        const wrapper = factory({ contentTier: ['*'] });

        const label = wrapper.find('[facetname="contentTier"]');

        label.props('prefixed').should.be.false;
      });
    });

    context('when facet name is not contentTier', () => {
      it('is prefixed', () => {
        const wrapper = factory({ TYPE: ['IMAGE'] });

        const label = wrapper.find('[facetname="TYPE"]');

        label.props('prefixed').should.be.true;
      });
    });
  });
});
