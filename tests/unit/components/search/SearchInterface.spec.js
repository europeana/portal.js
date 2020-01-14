import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import sinon from 'sinon';

import SearchInterface from '../../../../components/search/SearchInterface.vue';

const localVue = createLocalVue();
localVue.filter('localise', (number) => number);
localVue.filter('truncate', (string) => string);
localVue.filter('optimisedImageUrl', (string) => string);
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
        path: '/record/*',
        name: 'record-all'
      }
    ]
  });

  const mocks = {
    $i18n: {
      locale: 'en'
    },
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
        userParams: {},
        apiParams: {},
        results: [],
        themeFacetEnabled: true,
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
    describe('filters()', () => {
      context('with `null` query qf', () => {
        it('returns {}', async() => {
          const wrapper = await factory({
            storeState: {
              userParams: {
                qf: null
              }
            }
          });

          wrapper.vm.filters.should.eql({});
        });
      });

      context('with single query qf value', () => {
        it('returns it in an array on a property named for the facet', async() => {
          const wrapper = await factory({
            storeState: {
              userParams: {
                qf: 'TYPE:"IMAGE"'
              }
            }
          });

          wrapper.vm.filters.should.deep.eql({ 'TYPE': ['IMAGE'] });
        });
      });

      context('with multiple query qf values', () => {
        it('returns them in arrays on properties named for each facet', async() => {
          const query = { qf: ['TYPE:"IMAGE"', 'TYPE:"VIDEO"', 'REUSABILITY:"open"'] };
          const expected = { 'TYPE': ['IMAGE', 'VIDEO'], 'REUSABILITY': ['open'] };

          const wrapper = await factory({
            storeState: {
              userParams: query
            }
          });

          wrapper.vm.filters.should.deep.eql(expected);
        });
      });

      context('with reusability values', () => {
        it('returns them in an array on REUSABILITY property', async() => {
          const query = { reusability: 'open,restricted' };
          const expected = { 'REUSABILITY': ['open', 'restricted'] };

          const wrapper = await factory({
            storeState: {
              userParams: query
            }
          });

          wrapper.vm.filters.should.deep.eql(expected);
        });
      });

      context('with theme value', () => {
        it('returns it as a string on THEME property', async() => {
          const query = { theme: 'art' };
          const expected = { 'THEME': 'art' };

          const wrapper = await factory({
            storeState: {
              userParams: query
            }
          });

          wrapper.vm.filters.should.deep.eql(expected);
        });
      });

      context('with api value', () => {
        it('returns it as a string on api property', async() => {
          const query = { api: 'metadata' };
          const expected = { 'api': 'metadata' };

          const wrapper = await factory({
            storeState: {
              apiParams: query
            }
          });

          wrapper.vm.filters.should.deep.eql(expected);
        });
      });

      context('with query that has two colons', () => {
        it('returns an array with a string seperated by a colon ', async() => {
          const query = { qf: 'DATA_PROVIDER:"Galiciana: Biblioteca Digital de Galicia"' };
          const expected = { 'DATA_PROVIDER': ['Galiciana: Biblioteca Digital de Galicia'] };

          const wrapper = await factory({
            storeState: {
              userParams: query
            }
          });

          wrapper.vm.filters.should.deep.eql(expected);
        });
      });
    });

    describe('contentTierActiveState', () => {
      context('when contentTier facet includes "*"', () => {
        it('is `true`', async() => {
          const wrapper = await factory({
            storeState: {
              userParams: {
                qf: 'contentTier:*'
              }
            }
          });

          wrapper.vm.contentTierActiveState.should.be.true;
        });
      });

      context('when contentTier facet does not include "*"', () => {
        it('is `false`', async() => {
          const wrapper = await factory({
            storeState: {
              userParams: {
                qf: 'contentTier:1 OR 2 OR 3 OR 4'
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
                dcTitle: { def: ['Record 123/abc'] },
                edmPreview: 'https://www.example.org/abc.jpg',
                edmDataProvider: ['Provider 123']
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

      it('injects THEME first', () => {
        wrapper.vm.orderedFacets[0].name.should.eq('THEME');
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
        wrapper.vm.coreFacets.map(coreFacet => coreFacet.name).should.eql(['THEME', 'TYPE', 'REUSABILITY', 'COUNTRY']);
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
        wrapper.vm.moreFacets.map(moreFacet => moreFacet.name).should.eql(['LANGUAGE', 'PROVIDER', 'DATA_PROVIDER']);
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
        const initialSelectedQf = 'TYPE:"IMAGE"';
        const storeState = { userParams: { qf: initialSelectedQf } };

        context('and they changed', () => {
          const newSelectedValues = ['IMAGE', 'TEXT'];

          it('triggers rerouting', async() => {
            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.have.been.calledWith({ page: 1, qf: ['TYPE:"IMAGE"', 'TYPE:"TEXT"'] });
          });
        });

        context('and they were unchanged', () => {
          it('does not trigger rerouting', async() => {
            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, initialSelectedValues);
            searchRerouter.should.not.have.been.called;
          });
        });
      });

      context('when facet had no selected values', () => {
        const storeState = { userParams: {} };

        context('and some were selected', () => {
          const newSelectedValues = ['IMAGE', 'TEXT'];

          it('triggers rerouting', async() => {
            const wrapper = await factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.have.been.calledWith({ page: 1, qf: ['TYPE:"IMAGE"', 'TYPE:"TEXT"'] });
          });
        });

        context('and none were selected', () => {
          const newSelectedValues = [];

          it('does not trigger rerouting', async() => {
            const wrapper = factory({ storeState });
            const searchRerouter = sinon.spy(wrapper.vm, 'rerouteSearch');

            await wrapper.vm.changeFacet(facetName, newSelectedValues);
            searchRerouter.should.not.have.been.called;
          });
        });
      });
    });
  });
});
