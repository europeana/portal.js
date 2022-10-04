import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import SearchInterface from '@/components/search/SearchInterface.vue';

const localVue = createLocalVue();
localVue.filter('localise', (number) => number);
localVue.filter('truncate', (string) => string);
localVue.filter('optimisedImageUrl', (string) => string);
localVue.use(BootstrapVue);
localVue.use(Vuex);

const searchSetViewMutation = sinon.spy();
const searchSetMutation = sinon.spy();

const factory = (options = {}) => {
  const mocks = {
    $t: (key) => key,
    $path: () => '/',
    $goto: () => null,
    $features: { sideFilters: false, entityHeaderCards: false },
    $fetchState: options.fetchState || {},
    $route: { path: '/search', name: 'search', query: {} },
    $nuxt: { context: { res: {} } },
    localise: (val) => val,
    ...options.mocks
  };

  const store = new Vuex.Store({
    modules: {
      search: {
        namespaced: true,
        state: {
          facets: [],
          userParams: {},
          apiParams: {},
          results: [],
          totalResults: 1,
          ...options.storeState
        },
        getters: {
          filters: () => ({}),
          ...options.storeGetters
        },
        mutations: {
          set: searchSetMutation,
          setUserParams: () => null,
          setView: searchSetViewMutation
        },
        actions: {
          activate: () => null,
          run: () => null
        }
      },
      entity: {
        namespaced: true,
        state: {
          entity: {}
        }
      }
    },
    getters: {
      'debug/settings': () => {
        return { enabled: false, boosting: false, ...options.debugStore };
      }
    }
  });

  return shallowMountNuxt(SearchInterface, {
    localVue,
    mocks,
    store,
    propsData: options.propsData,
    stubs: ['SideFilters', 'i18n']
  });
};

describe('components/search/SearchInterface', () => {
  beforeEach(() => sinon.resetHistory());

  describe('template', () => {
    describe('with `error` in search state', () => {
      it('displays the message', () => {
        const errorMessage = 'Something went very wrong';
        const wrapper = factory({
          storeState: {
            error: errorMessage
          }
        });

        const errorNotice = wrapper.find(`[error="${errorMessage}"]`);

        expect(errorNotice).toBeDefined();
      });
    });
  });

  describe('fetch', () => {
    it('activates the search in the store', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm.$store, 'dispatch');

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.dispatch.calledWith('search/activate')).toBe(true);
    });

    it('commits user params to the store from the route query', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm.$store, 'commit');
      const routeQuery = { query: 'history', page: 2 };
      wrapper.vm.$route = { query: routeQuery };

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.commit.calledWith('search/set', ['userParams', routeQuery])).toBe(true);
    });

    it('runs the search via the store', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm.$store, 'dispatch');

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.dispatch.calledWith('search/run')).toBe(true);
    });

    it('handles search API errors', async() => {
      const wrapper = factory({ storeState: { error: new Error('API error'), errorStatusCode: 400 } });
      process.server = true;

      let error;

      try {
        await wrapper.vm.fetch();
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('API error');
      expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(400);
    });

    it('treats no results as an error', async() => {
      const wrapper = factory({ storeState: { totalResults: 0 } });

      let error;

      try {
        await wrapper.vm.fetch();
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('noResults');
    });

    it('scrolls to the page header element', async() => {
      const wrapper = factory();
      wrapper.vm.$scrollTo = sinon.spy();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$scrollTo.calledWith('#header')).toBe(true);
    });
  });

  describe('computed', () => {
    describe('errorMessage', () => {
      describe('when there was a pagination error', () => {
        it('returns a user-friendly error message', async() => {
          const wrapper = factory({
            fetchState: {
              error: {
                message: 'Sorry! It is not possible to paginate beyond the first 5000 search results.'
              }
            }
          });

          expect(wrapper.vm.errorMessage).toBe('messages.paginationLimitExceeded');
        });
      });
    });

    describe('noMoreResults', () => {
      describe('when there are 0 results in total', () => {
        const wrapper = factory({
          storeState: { totalResults: 0 }
        });

        it('is `false`', () => {
          expect(wrapper.vm.noMoreResults).toBe(false);
        });
      });

      describe('when there are some results in total', () => {
        describe('and results here', () => {
          const wrapper = factory({
            storeState: {
              totalResults: 100,
              results: [
                {
                  europeanaId: '/123/abc',
                  dcTitle: { def: ['Record 123/abc'] },
                  edmPreview: 'https://www.example.org/abc.jpg',
                  edmDataProvider: ['Provider 123']
                }
              ]
            }
          });

          it('is `false`', () => {
            expect(wrapper.vm.noMoreResults).toBe(false);
          });
        });

        describe('but no results here', () => {
          const wrapper = factory({
            storeState: {
              totalResults: 100
            }
          });

          it('is `true`', () => {
            expect(wrapper.vm.noMoreResults).toBe(true);
          });
        });
      });
    });

    describe('view', () => {
      describe('setter', () => {
        it('commits to the search store', () => {
          const wrapper = factory();
          const view = 'list';

          wrapper.vm.view = view;

          expect(searchSetViewMutation.calledWith(sinon.match.any, view)).toBe(true);
        });
      });
    });

    describe('debugSettings', () => {
      it('reads the debug settings from the store', () => {
        const wrapper = factory();

        expect(wrapper.vm.debugSettings).toStrictEqual({ enabled: false, boosting: false });
      });
    });

    describe('showSearchBoostingForm', () => {
      it('is true when the boosting toggle is enabled', () => {
        const wrapper = factory({ debugStore: { boosting: true } });

        expect(wrapper.vm.showSearchBoostingForm).toBe(true);
      });

      it('is false when the boosting toggle is disabled', () => {
        const wrapper = factory();

        expect(wrapper.vm.showSearchBoostingForm).toBe(false);
      });
    });
  });

  describe('methods', () => {
    describe('handlePaginationChanged', () => {
      it('is triggered by "change" event on search results pagination', () => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, '$fetch');
        expect(wrapper.vm.paginationChanged).toBe(false);

        const pagination = wrapper.find('[data-qa="search results pagination"]');
        pagination.vm.$emit('change');

        expect(wrapper.vm.paginationChanged).toBe(true);
        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });

    describe('handleResultsDrawn', () => {
      const linkStub = { focus: sinon.spy() };
      const cardRefs = [
        { $el: { getElementsByTagName: sinon.stub().withArgs('a').returns([linkStub]) } }
      ];

      describe('when pagination changed', () => {
        it('sets focus to link in first card element from refs', () => {
          const wrapper = factory();
          wrapper.setData({ paginationChanged: true });

          wrapper.vm.handleResultsDrawn(cardRefs);

          expect(linkStub.focus.called).toBe(true);
        });

        it('resets paginationChanged', () => {
          const wrapper = factory();
          wrapper.setData({ paginationChanged: true });

          wrapper.vm.handleResultsDrawn(cardRefs);

          expect(wrapper.vm.paginationChanged).toBe(false);
        });
      });

      it('does not change the focus', () => {
        const wrapper = factory();
        wrapper.setData({ paginationChanged: false });

        wrapper.vm.handleResultsDrawn(cardRefs);

        expect(linkStub.focus.called).toBe(false);
      });
    });

    describe('watchRouteQueryQf', () => {
      describe('when values have been added', () => {
        describe('and old value was `undefined`', () => {
          const oldVal = undefined;
          const newVal = 'TYPE:"TEXT"';

          it('triggers $fetch', () => {
            const wrapper = factory();
            sinon.spy(wrapper.vm, '$fetch');

            wrapper.vm.watchRouteQueryQf(newVal, oldVal);

            expect(wrapper.vm.$fetch.called).toBe(true);
          });
        });

        describe('and old value was present', () => {
          const oldVal = 'TYPE:"TEXT"';
          const newVal = ['TYPE:"TEXT"', 'TYPE:"IMAGE"'];

          it('triggers $fetch', () => {
            const wrapper = factory();
            sinon.spy(wrapper.vm, '$fetch');

            wrapper.vm.watchRouteQueryQf(newVal, oldVal);

            expect(wrapper.vm.$fetch.called).toBe(true);
          });
        });
      });

      describe('when values have been removed', () => {
        describe('and new value is `undefined`', () => {
          const oldVal = 'TYPE:"TEXT"';
          const newVal = undefined;

          it('triggers $fetch', () => {
            const wrapper = factory();
            sinon.spy(wrapper.vm, '$fetch');

            wrapper.vm.watchRouteQueryQf(newVal, oldVal);

            expect(wrapper.vm.$fetch.called).toBe(true);
          });
        });

        describe('and new value is present', () => {
          const oldVal = ['TYPE:"TEXT"', 'TYPE:"IMAGE"'];
          const newVal = 'TYPE:"TEXT"';

          it('triggers $fetch', () => {
            const wrapper = factory();
            sinon.spy(wrapper.vm, '$fetch');

            wrapper.vm.watchRouteQueryQf(newVal, oldVal);

            expect(wrapper.vm.$fetch.called).toBe(true);
          });
        });
      });

      describe('when values have not changed', () => {
        describe('and both are `undefined`', () => {
          const oldVal = undefined;
          const newVal = undefined;

          it('does not trigger $fetch', () => {
            const wrapper = factory();
            sinon.spy(wrapper.vm, '$fetch');

            wrapper.vm.watchRouteQueryQf(newVal, oldVal);

            expect(wrapper.vm.$fetch.called).toBe(false);
          });
        });

        describe('and both are present', () => {
          const oldVal = ['TYPE:"TEXT"', 'TYPE:"IMAGE"'];
          const newVal = ['TYPE:"TEXT"', 'TYPE:"IMAGE"'];

          it('does not trigger $fetch', () => {
            const wrapper = factory();
            sinon.spy(wrapper.vm, '$fetch');

            wrapper.vm.watchRouteQueryQf(newVal, oldVal);

            expect(wrapper.vm.$fetch.called).toBe(false);
          });
        });
      });
    });

    describe('viewFromRouteQuery', () => {
      describe('with view in route query', () => {
        const route = { query: { view: 'mosaic', query: 'sport' } };

        it('updates the stored view', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetViewMutation.calledWith(sinon.match.any, 'mosaic')).toBe(true);
        });

        it('sets searchResultsView cookie', () => {
          const wrapper = factory({ mocks: { $route: route, $cookies: { set: sinon.spy() } } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(wrapper.vm.$cookies.set.calledWith('searchResultsView', 'mosaic')).toBe(true);
        });

        it('commit route query to store as userParams', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetMutation.calledWith(
            sinon.match.any, ['userParams', sinon.match(route.query)]
          )).toBe(true);
        });
      });

      describe('without view in route query', () => {
        const route = { query: { query: 'sport' } };

        it('does not update the stored view', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });
          sinon.resetHistory();

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetViewMutation.called).toBe(false);
        });

        it('does not set searchResultsView cookie', () => {
          const wrapper = factory({ mocks: { $route: route, $cookies: { set: sinon.spy() } } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(wrapper.vm.$cookies.set.called).toBe(false);
        });

        it('does not commit route query to store as userParams', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.viewFromRouteQuery();

          expect(searchSetMutation.called).toBe(false);
        });
      });
    });
  });
});
