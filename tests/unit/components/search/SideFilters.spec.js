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
  describe('computed properties', () => {
    describe('orderedFacets', () => {
      const wrapper = factory({
        storeState: {
          facets: [
            { name: 'COUNTRY' },
            { name: 'RIGHTS' },
            { name: 'CONTRIBUTOR' },
            { name: 'DATA_PROVIDER' },
            { name: 'PROVIDER' },
            { name: 'LANGUAGE' },
            { name: 'REUSABILITY' },
            { name: 'TYPE' }
          ]
        }
      });

      it('injects collection first', () => {
        wrapper.vm.orderedFacets[0].name.should.eq('collection');
      });

      it('follows with ordered default facets from search plugin', () => {
        wrapper.vm.orderedFacets[1].name.should.eq('TYPE');
        wrapper.vm.orderedFacets[2].name.should.eq('REUSABILITY');
        wrapper.vm.orderedFacets[3].name.should.eq('COUNTRY');
        wrapper.vm.orderedFacets[4].name.should.eq('LANGUAGE');
        wrapper.vm.orderedFacets[5].name.should.eq('PROVIDER');
        wrapper.vm.orderedFacets[6].name.should.eq('DATA_PROVIDER');
      });

      it('ends with any other facets in their original order', () => {
        wrapper.vm.orderedFacets[7].name.should.eq('RIGHTS');
        wrapper.vm.orderedFacets[8].name.should.eq('CONTRIBUTOR');
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
