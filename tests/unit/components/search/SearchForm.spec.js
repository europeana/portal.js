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
  stubs: { 'b-input-group': true,
    'b-button': true,
    'b-form': true,
    'b-form-input': { template: '<input ref="searchinput" />' } },
  mocks: {
    ...{
      $i18n: { locale: 'en' },
      $t: () => {},
      $route: { query: { query: '' } },
      $goto,
      $path
    }, ...(options.mocks || {})
  },
  store: options.store || store({ search: { allThemes: [] } })
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
        expect($goto.calledWith(newRouteParams)).toBe(true);
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
          expect($goto.calledWith(newRouteParams)).toBe(true);
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
        expect($goto.calledWith(newRouteParams)).toBe(true);
      });

      it('does not carry non-search query params', async() => {
        const wrapper = factory({ store: store(state), mocks: { $route: { query: { lang: 'it' } } } });

        await wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: state.search.view }
        };
        expect($goto.calledWith(newRouteParams)).toBe(true);
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

        expect(mocks.$apis.entity.suggest.called).toBe(true);
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

  describe('when search options show, not on a collection page and no query set', () => {
    it('shows search options dropdown', async() => {
      const wrapper = factory({ store: store({ search: { allThemes: [], view: 'grid' } }) });

      await wrapper.setData({ showSearchOptions: true });
      const searchFormDropdown = wrapper.find('[data-qa="search form dropdown"]');

      expect(searchFormDropdown.exists()).toBe(true);
    });
  });

  describe('on route query changes', () => {
    it('hides the search options', async() => {
      const wrapper = factory();

      await wrapper.setData({ showSearchOptions: true });
      wrapper.vm.$route.query.query = 'new query';
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });
  });

  describe('when user clicks outside the search form dropdown', () => {
    it('hides the search options', async() => {
      const clickOutsideEvent = new Event('click');
      const wrapper = factory();

      await wrapper.setData({ showSearchOptions: true });
      wrapper.vm.clickOutside(clickOutsideEvent);

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });
  });

  describe('when user tabs outside the search form dropdown', () => {
    it('hides the search options', async() => {
      const tabOutsideEvent = new KeyboardEvent('keydown', { 'key': 'Tab' });
      const wrapper = factory();

      await wrapper.setData({ showSearchOptions: true });
      wrapper.vm.clickOutside(tabOutsideEvent);

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });
  });
});
