import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchForm from '@/components/search/SearchForm.vue';
import Vuex from 'vuex';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(Vuex);

const $goto = sinon.spy();

const $path = sinon.stub();
$path.withArgs({ name: 'search' }).returns('/search');
$path.withArgs({
  name: 'collections-type-all', params: {
    type: 'topic',
    pathMatch: '227-fresco'
  }
}).returns('/collections/topic/227-fresco');
$path.withArgs({
  name: 'collections-type-all', params: {
    type: 'person',
    pathMatch: '59981-frank-sinatra'
  }
}).returns('/collections/person/59981-frank-sinatra');

const factory = (options = {}) => shallowMount(SearchForm, {
  localVue,
  stubs: ['b-input-group', 'b-button', 'b-form', 'b-form-input'],
  mocks: {
    ...{
      $i18n: { locale: 'en' },
      $t: () => {},
      $route: { query: {} },
      $goto,
      $path
    }, ...(options.mocks || {})
  },
  store: options.store || store({ search: {} })
});

const getters = {
  'search/activeView': (state) => state.search.view,
  'search/queryUpdatesForFacetChanges': () => () => {}
};
const store = (state = {}) => {
  return new Vuex.Store({
    getters,
    state: {
      i18n: { locale: 'en' },
      ...state
    }
  });
};

describe('components/search/SearchForm', () => {
  beforeEach(() => {
    $goto.resetHistory();
  });

  describe('query', () => {
    it('is read from the route', () => {
      const wrapper = factory({
        mocks: {
          $route: {
            query: {
              query: 'cartography'
            }
          }
        }
      });
      expect(wrapper.vm.query).toBe('cartography');
    });
  });

  describe('routePath', () => {
    describe('when on a search page', () => {
      const wrapper = factory({
        mocks: {
          $route: {
            path: '/somewhere',
            query: {}
          }
        },
        store: store({
          search: {
            active: true
          }
        })
      });

      it('uses current route path', () => {
        expect(wrapper.vm.routePath).toBe('/somewhere');
      });
    });

    describe('when not on a search page', () => {
      const wrapper = factory({
        mocks: {
          $path
        },
        store: store({
          search: {
            active: false
          }
        })
      });

      it('uses default search route path', () => {
        expect(wrapper.vm.routePath).toEqual('/search');
      });
    });
  });

  describe('form submission', () => {
    const query = 'trees';

    describe('with a selected entity suggestion', () => {
      it('routes to the entity page', async() => {
        const state = {
          search: {
            active: true,
            view: 'grid'
          }
        };
        const wrapper = factory({ store: store(state) });

        await wrapper.setData({
          selectedOptionLink: { path: '/search', query: { query: '"Fresco"', view: state.search.view } }
        });
        wrapper.vm.submitForm();

        let searchRoute = {
          path: '/search',
          query: {
            query: '"Fresco"',
            view: 'grid'
          }
        };

        expect($goto.calledWith(searchRoute));
      });
    });

    describe('when on a search page', () => {
      const state = {
        search: {
          active: true,
          view: 'grid'
        }
      };

      it('updates current route', async() => {
        const wrapper = factory({ store: store(state) });

        await wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: wrapper.vm.$route.path,
          query: { query, page: 1, view: state.search.view }
        };
        expect($goto.calledWith(newRouteParams));
      });

      describe('when query is blank', () => {
        it('includes empty query param', async() => {
          const wrapper = factory({ store: store(state) });

          await wrapper.setData({
            query: undefined
          });
          wrapper.vm.submitForm();

          const newRouteParams = {
            path: wrapper.vm.$route.path,
            query: { query: '', page: 1, view: state.search.view }
          };
          expect($goto.calledWith(newRouteParams));
        });
      });
    });

    describe('when not on a search page', () => {
      const state = {
        search: {
          active: false,
          view: 'list'
        }
      };
      it('reroutes to search', async() => {
        const wrapper = factory({ store: store(state) });

        await wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: state.search.view }
        };
        expect($goto.calledWith(newRouteParams));
      });

      it('does not carry non-seearch query params', async() => {
        const wrapper = factory({ store: store(state), mocks: { $route: { query: { lang: 'it' } } } });

        await wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: state.search.view }
        };
        expect($goto.calledWith(newRouteParams));
      });
    });
  });

  describe('suggestionLinkGen', () => {
    const state = {
      search: {
        active: false,
        userParams: {
          query: ''
        },
        view: 'grid'
      }
    };
    const wrapper = factory({ store: store(state) });

    it('generates search suggestion URLs', () => {
      const link = wrapper.vm.suggestionLinkGen('Fresco');
      expect(link.path).toBe('/search');
      expect(link.query.query).toBe('"Fresco"');
      expect(link.query.view).toBe('grid');
    });
  });

  describe('getSearchSuggestions', () => {
    const query = 'something';
    describe('auto-suggest is enabled by default', () => {
      const mocks = {
        $apis: {
          entity: {
            suggest: sinon.stub().resolves([])
          }
        }
      };

      const wrapper = factory({ mocks });

      it('gets suggestions from the Entity API', async() => {
        await wrapper.vm.getSearchSuggestions(query);

        expect(mocks.$apis.entity.suggest.called);
      });
    });

    describe('auto-suggest is disabled on collection page', () => {
      const mocks = {
        $apis: {
          entity: {
            suggest: sinon.stub().resolves([])
          }
        }
      };
      const store = new Vuex.Store({
        state: { search: {}, ui: {}, entity: { id: '123' } }
      });

      const wrapper = factory({ store, mocks });

      it('gets suggestions from the Entity API', async() => {
        await wrapper.vm.getSearchSuggestions(query);

        expect(mocks.$apis.entity.suggest.called).toBe(false);
      });

      // FIXME
      // it('parses and stores suggestions locally', async() => {
      //   await wrapper.vm.getSearchSuggestions();
      //
      //   expect(wrapper.vm.suggestions).toEqual(parsedSuggestions);
      // });
    });
  });
});
