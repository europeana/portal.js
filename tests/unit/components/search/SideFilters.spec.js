import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

import SideFilters from '@/components/search/SideFilters.vue';
import { defaultFacetNames } from '@/store/search';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const factory = (options = {}) => {
  const router = new VueRouter({
    routes: [
      {
        path: '/search',
        name: 'search'
      },
      {
        path: '/item/*',
        name: 'item-all'
      }
    ]
  });

  const mocks = {
    $t: (key) => key,
    $path: () => '/',
    $goto: () => null,
    ...options.mocks
  };
  const store = new Vuex.Store({
    modules: {
      search: {
        namespaced: true,
        state: {
          facets: [],
          userParams: {},
          collectionFacetEnabled: true,
          resettableFilters: [],
          ...options.storeState
        },
        getters: {
          facetNames() {
            return defaultFacetNames;
          },
          filters: () => {
            return {};
          },
          collection: () => null,
          queryUpdatesForFacetChanges: () => () => {
            return {};
          },
          ...options.storeGetters
        },
        mutations: {
          setShowFiltersToggle: () => null
        }
      }
    }
  });
  return shallowMount(SideFilters, {
    localVue,
    mocks,
    router,
    store,
    propsData: options.propsData
  });
};

describe('components/search/SideFilters', () => {
  describe('computed', () => {
    describe('filterableFacets', () => {
      const facetNames = ['TYPE', 'COUNTRY'];
      const storeGetters = {
        facetNames: () => facetNames
      };

      it('includes facets from store, without static fields', () => {
        const wrapper = factory({ storeGetters });

        for (const facetName of facetNames) {
          wrapper.vm.filterableFacets.some(facet => (facet.name === facetName) && !facet.staticFields).should.be.true;
        }
      });

      context('when collection facet is enabled', () => {
        const storeState = { collectionFacetEnabled: true };

        it('includes collection facet first, with static fields', () => {
          const wrapper = factory({ storeGetters, storeState });

          const firstFacet = wrapper.vm.filterableFacets[0];
          firstFacet.name.should.eq('collection');
          Array.isArray(firstFacet.staticFields).should.be.true;
        });
      });

      context('when collection facet is disabled', () => {
        const storeState = { collectionFacetEnabled: false };

        it('omits collection facet', () => {
          const wrapper = factory({ storeGetters, storeState });

          wrapper.vm.filterableFacets.some(facet => facet.name === 'collection').should.be.false;
        });
      });
    });
  });

  describe('methods', () => {
    describe('changeFacet', () => {
      const facetName = 'TYPE';

      context('when facet had selected values', () => {
        const initialSelectedValues = ['"IMAGE"'];
        const storeGetters = {
          filters: () => {
            return { 'TYPE': ['"IMAGE"'] };
          }
        };

        context('and they changed', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.have.been.called;
          });
        });

        context('and they were unchanged', () => {
          it('does not trigger rerouting', async() => {
            const wrapper = factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, initialSelectedValues);
            searchRerouter.should.not.have.been.called;
          });
        });
      });

      context('when facet had no selected values', () => {
        const storeGetters = {
          filters: () => {
            return {};
          }
        };

        context('and some were selected', () => {
          const newSelectedValues = ['"IMAGE"', '"TEXT"'];

          it('triggers rerouting', async() => {
            const wrapper = await factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.have.been.called;
          });
        });

        context('and none were selected', () => {
          const newSelectedValues = [];

          it('does not trigger rerouting', async() => {
            const wrapper = factory({ storeGetters });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.not.have.been.called;
          });
        });
      });
    });
  });
});
