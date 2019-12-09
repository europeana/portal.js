import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

import SearchInterface from '../../../../components/search/SearchInterface.vue';

const localVue = createLocalVue();
localVue.filter('localise', (number) => number);
localVue.filter('truncate', (string) => string);
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter({
  routes: [
    {
      path: '/search',
      name: 'search'
    },
    {
      path: '/record/*',
      name: 'record-all'
    }
  ]
});

const factory = (options = {}) => {
  const mocks = {
    $t: (key) => key,
    $tc: (key) => key,
    $te: () => false,
    localePath: (opts) => opts,
    ...options.mocks
  };
  const store = new Vuex.Store({
    state: {
      search: {
        facets: [],
        qf: [],
        results: [],
        filters: {},
        ...options.storeState
      },
      entity: {
        id: null
      }
    }
  });
  return mount(SearchInterface, {
    localVue,
    mocks,
    router,
    store,
    propsData: options.propsData
  });
};

describe('components/search/SearchInterface', () => {
  describe('output', () => {
    context('with `error` in search state', () => {
      it('displays the message', () => {
        const errorMessage = 'Something went very wrong';
        const wrapper = factory({
          storeState: {
            error: errorMessage
          }
        });

        const errorNotice = wrapper.find('[data-qa="error notice"]');

        errorNotice.text().should.include(errorMessage);
      });
    });
  });

  describe('computed properties', () => {
    describe('contentTierActiveState', () => {
      context('when contentTier facet includes "*"', () => {
        it('is `true`', () => {
          const wrapper = factory({
            storeState: {
              filters: {
                contentTier: ['*']
              }
            }
          });

          wrapper.vm.contentTierActiveState.should.be.true;
        });
      });

      context('when contentTier facet does not include "*"', () => {
        it('is `false`', () => {
          const wrapper = factory({
            storeState: {
              filters: {
                contentTier: ['1 OR 2 OR 3 OR 4']
              }
            }
          });

          wrapper.vm.contentTierActiveState.should.be.false;
        });
      });
    });

    describe('errorMessage', () => {
      context('when there was a pagination error', () => {
        it('returns a user-friendly error message', async() => {
          const wrapper = factory({
            storeState: {
              error: 'Sorry! It is not possible to paginate beyond the first 5000 search results.'
            }
          });

          wrapper.vm.errorMessage.should.eq('messages.paginationLimitExceeded');
        });
      });
    });

    describe('noMoreResults', () => {
      context('when there are 0 results in total', () => {
        const wrapper = factory({
          storeState: { totalResults: 0 }
        });

        it('is `false`', () => {
          wrapper.vm.noMoreResults.should.be.false;
        });
      });

      context('when there are some results in total', () => {
        context('and results here', () => {
          const wrapper = factory({
            storeState: {
              totalResults: 100,
              results: [{
                europeanaId: '/123/abc',
                fields: {
                  dcTitle: ['Title']
                }
              }]
            }
          });

          it('is `false`', () => {
            wrapper.vm.noMoreResults.should.be.false;
          });
        });

        context('but no results here', () => {
          const wrapper = factory({
            storeState: {
              totalResults: 100
            }
          });

          it('is `true`', () => {
            wrapper.vm.noMoreResults.should.be.true;
          });
        });
      });
    });

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

      it('follows with ordered default facets from search plugin', () => {
        wrapper.vm.orderedFacets[0].name.should.eq('TYPE');
        wrapper.vm.orderedFacets[1].name.should.eq('REUSABILITY');
        wrapper.vm.orderedFacets[2].name.should.eq('COUNTRY');
        wrapper.vm.orderedFacets[3].name.should.eq('LANGUAGE');
        wrapper.vm.orderedFacets[4].name.should.eq('PROVIDER');
        wrapper.vm.orderedFacets[5].name.should.eq('DATA_PROVIDER');
      });

      it('ends with any other facets in their original order', () => {
        wrapper.vm.orderedFacets[6].name.should.eq('RIGHTS');
        wrapper.vm.orderedFacets[7].name.should.eq('CONTRIBUTOR');
      });
    });

    describe('coreFacets', () => {
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

      it('returns core facets only', () => {
        wrapper.vm.coreFacets.should.eql([ { 'name': 'TYPE' }, { 'name': 'REUSABILITY' }, { 'name': 'COUNTRY' } ]);
      });
    });

    describe('moreFacets', () => {
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

      it('returns non-core facets only', () => {
        wrapper.vm.moreFacets.should.eql([ { 'name': 'LANGUAGE' }, { 'name': 'PROVIDER' }, { 'name': 'DATA_PROVIDER' } ]);
      });
    });
  });

  describe('methods', () => {
    describe('queryUpdatesForFacetChanges', () => {
      const wrapper = factory();

      context('when facet is REUSABILITY', () => {
        const selected = { 'REUSABILITY': ['open', 'permission' ] };

        context('with values selected', () => {
          it('sets `reusability` to values joined with ","', () => {
            const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);
            updates.reusability.should.eq('open,permission');
          });
        });

        context('with no values selected', () => {
          it('sets `reusability` to `null`', () => {
            const wrapper = factory();
            const updates = wrapper.vm.queryUpdatesForFacetChanges();
            updates.should.eql({ qf: [], page: 1 });
          });
        });
      });

      context('for default facets from search plugin supporting quotes', () => {
        it('includes fielded and quoted queries for each value in `qf`', () => {
          const selected = { 'TYPE': ['IMAGE', 'SOUND'] };
          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);
          updates.qf.should.include('TYPE:"IMAGE"');
          updates.qf.should.include('TYPE:"SOUND"');
        });
      });

      context('for default facets from search plugin not supporting quotes', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const selected = { 'MIME_TYPE': ['application/pdf'] };
          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);
          updates.qf.should.include('MIME_TYPE:application/pdf');
        });
      });

      context('for any other facets', () => {
        it('includes fielded but unquoted queries for each value in `qf`', () => {
          const selected = { 'contentTier': ['4'] };
          const updates = wrapper.vm.queryUpdatesForFacetChanges(selected);
          updates.qf.should.include('contentTier:4');
        });
      });
    });

    describe('changeFacet', () => {
      const facetName = 'TYPE';

      context('when facet had selected values', () => {
        const initialSelectedValues = ['IMAGE'];
        context('and they changed', () => {
          const newSelectedValues = ['IMAGE', 'TEXT'];
          it('triggers rerouting', () => {
            const storeState = { filters: {} };
            storeState.filters[facetName] = initialSelectedValues;

            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.have.been.calledWith({ page: 1, qf: ['TYPE:"IMAGE"', 'TYPE:"TEXT"'] });
          });
        });

        context('and they were unchanged', () => {
          it('does not trigger rerouting', () => {
            const storeState = { filters: {} };
            storeState.filters[facetName] = initialSelectedValues;

            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            wrapper.vm.changeFacet(facetName, initialSelectedValues);
            searchRerouter.should.not.have.been.called;
          });
        });
      });

      context('when facet had no selected values', () => {
        context('and some were selected', () => {
          const newSelectedValues = ['IMAGE', 'TEXT'];
          it('triggers rerouting', () => {
            const storeState = { filters: {} };

            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.have.been.calledWith({ page: 1, qf: ['TYPE:"IMAGE"', 'TYPE:"TEXT"'] });
          });
        });

        context('and none were selected', () => {
          const newSelectedValues = [];
          it('does not trigger rerouting', () => {
            const storeState = { filters: {} };

            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.not.have.been.called;
          });
        });
      });
    });
  });
});
