import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchForm from '../../../../src/components/search/SearchForm.vue';
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
      wrapper.vm.query.should.eq('cartography');
    });
  });

  describe('routePath', () => {
    context('when on a search page', () => {
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
        wrapper.vm.routePath.should.eq('/somewhere');
      });
    });

    context('when not on a search page', () => {
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
        wrapper.vm.routePath.should.eql('/search');
      });
    });
  });

  describe('form submission', () => {
    const query = 'trees';

    context('with a selected entity suggestion', () => {
      it('routes to the entity page', async() => {
        const state = {
          active: true,
          userParams: {
            query: ''
          },
          view: 'grid'
        };
        const wrapper = factory({ store: store({ search: { showSearchBar: true } }) });

        wrapper.setData({
          selectedOptionLink: { path: '/search', query: { query: '"Fresco"', view: state.view } }
        });
        wrapper.vm.submitForm();

        let searchRoute = {
          path: '/search',
          query: {
            query: '"Fresco"',
            view: state.view
          }
        };

        $goto.should.have.been.calledWith(searchRoute);
      });
    });

    context('when on a search page', () => {
      it('updates current route', () => {
        const state = {
          search: {
            active: true,
            userParams: {
              query: ''
            },
            view: 'grid'
          }
        };
        const wrapper = factory({ store: store(state) });

        wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: wrapper.vm.$route.path,
          query: { query, page: 1, view: state.search.view }
        };
        $goto.should.have.been.calledWith(newRouteParams);
      });
    });

    context('when not on a search page', () => {
      it('reroutes to search', () => {
        const state = {
          search: {
            active: false,
            userParams: {
              query: ''
            },
            view: 'list'
          }
        };
        const wrapper = factory({ store: store(state) });

        wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: state.search.view }
        };
        $goto.should.have.been.calledWith(newRouteParams);
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
      link.path.should.eq('/search');
      link.query.query.should.eq('"Fresco"');
      link.query.view.should.eq('grid');
    });
  });

  describe('getSearchSuggestions', () => {
    const query = 'something';
    context('auto-suggest is enabled by default', () => {
      const mocks = {
        $apis: {
          entity: {
            getEntitySuggestions: sinon.stub().resolves([])
          }
        }
      };

      const wrapper = factory({ mocks });

      it('gets suggestions from the Entity API', async() => {
        await wrapper.vm.getSearchSuggestions(query);

        mocks.$apis.entity.getEntitySuggestions.should.have.been.called;
      });
    });

    context('auto-suggest is disabled on collection page', () => {
      const mocks = {
        $apis: {
          entity: {
            getEntitySuggestions: sinon.stub().resolves([])
          }
        }
      };
      const store = new Vuex.Store({
        state: { search: {}, ui: {}, entity: { id: '123' } }
      });

      const wrapper = factory({ store, mocks });

      it('gets suggestions from the Entity API', async() => {
        await wrapper.vm.getSearchSuggestions(query);

        mocks.$apis.entity.getEntitySuggestions.should.not.have.been.called;
      });

      // FIXME
      // it('parses and stores suggestions locally', async() => {
      //   await wrapper.vm.getSearchSuggestions();
      //
      //   wrapper.vm.suggestions.should.deep.eq(parsedSuggestions);
      // });
    });
  });
});
