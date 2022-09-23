import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import SearchForm from '@/components/search/SearchForm.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

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

const factory = ({ propsData, data, stubs, mocks } = {}) => shallowMount(SearchForm, {
  localVue,
  propsData: {
    inTopNav: propsData ? propsData.inTopNav : true,
    ...propsData
  },
  data: () => (data || {}),
  stubs: { ...stubs },
  mocks: {
    $i18n: { locale: 'en' },
    $t: () => {},
    $route: { path: '', query: { query: '' } },
    $goto,
    $path,
    $matomo: {
      trackEvent: sinon.spy()
    },
    ...(mocks || {}),
    $store: {
      getters: {
        'search/activeView': 'grid',
        ...mocks?.$store?.getters || {}
      },
      state: {
        entity: {},
        search: {},
        ...mocks?.$store?.state || {}
      }
    }
  }
});

const fullFactory = () => mount(SearchForm, {
  localVue,
  propsData: {
    absoluteTopPositioned: true
  },
  mocks: {
    $i18n: { locale: 'en' },
    $t: () => {},
    $route: { path: '', query: { query: '' } },
    $path,
    $apis: { entity: { suggest: sinon.stub().resolves() } },
    $store: {
      getters: {
        'search/activeView': 'grid'
      },
      state: {
        entity: {},
        search: {}
      }
    }
  },
  attachTo: document.body,
  stubs: ['SearchQueryOptions']
});

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
          },
          $store: {
            state: {
              search: {
                active: true
              }
            }
          }
        }
      });

      it('uses current route path', () => {
        expect(wrapper.vm.routePath).toBe('/somewhere');
      });
    });

    describe('when not on a search page', () => {
      const wrapper = factory({
        mocks: {
          $path,
          $store: {
            state: {
              search: {
                active: false
              }
            }
          }
        }
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
        const wrapper = factory({ mocks: { $store: { state } } });

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

      it('tracks the suggestion not selected event', async() => {
        const wrapper = factory({ mocks: { $store: { state } } });

        await wrapper.setData({
          query,
          suggestions: { ['http://data.europeana.eu/concept/123']: '"Trees"',
            ['http://data.europeana.eu/concept/124']: '"Tree houses"' }
        });
        wrapper.vm.submitForm();

        // const newRouteParams = {
        //   path: wrapper.vm.$route.path,
        //   query: { query, page: 1, view: state.search.view }
        // };
        // expect($goto.calledWith(newRouteParams)).toBe(true);
        expect(wrapper.vm.$matomo.trackEvent.calledWith('Autosuggest_option_not_selected', 'Autosuggest option is not selected', query)).toBe(true);
      });

      describe('when query is blank', () => {
        it('includes empty query param', async() => {
          const wrapper = factory({ mocks: { $store: { state } } });

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
      const $store = {
        getters: {
          'search/activeView': 'list'
        },
        state: {
          search: {
            active: false
          }
        }
      };
      it('reroutes to search', async() => {
        const wrapper = factory({ mocks: { $store } });

        await wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: $store.getters['search/activeView'] }
        };
        expect($goto.calledWith(newRouteParams)).toBe(true);
      });

      it('does not carry non-search query params', async() => {
        const wrapper = factory({ mocks: { $store, $route: { query: { lang: 'it' } } } });

        await wrapper.setData({
          query
        });
        wrapper.vm.submitForm();

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: $store.getters['search/activeView'] }
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
    const wrapper = factory({ mocks: { $store: { state } } });

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

    describe('when on a collection page', () => {
      const mocks = {
        $apis: {
          entity: {
            suggest: sinon.stub().resolves([])
          }
        }
      };

      describe('and a collection label is stored', () => {
        const state = { search: { collectionLabel: 'Entity 123' }, ui: {}, entity: { id: '123' } };

        it('does not get suggestions from the Entity API', async() => {
          const wrapper = factory({ mocks: { ...mocks, $store: { state } } });

          await wrapper.vm.getSearchSuggestions(query);

          expect(mocks.$apis.entity.suggest.called).toBe(false);
        });
      });

      describe('but no collection label is stored', () => {
        const state = { search: { collectionLabel: null }, ui: {}, entity: { id: '123' } };

        it('does get suggestions from the Entity API', async() => {
          const wrapper = factory({ mocks: { ...mocks, $store: { state } } });

          await wrapper.vm.getSearchSuggestions(query);

          expect(mocks.$apis.entity.suggest.called).toBe(true);
        });
      });
    });

    describe('when on the home page', () => {
      const mocks = {
        $apis: {
          entity: {
            suggest: sinon.stub().resolves([])
          }
        }
      };

      it('does NOT get suggestions from the Entity API', async() => {
        const wrapper = factory({ mocks, propsData: { inTopNav: false } });

        await wrapper.vm.getSearchSuggestions(query);

        expect(mocks.$apis.entity.suggest.called).toBe(false);
      });
    });
  });

  describe('when search options show, not on a collection page and no query set', () => {
    const state = { search: { allThemes: [], view: 'grid' } };
    it('shows search options dropdown', async() => {
      const wrapper = factory({ mocks: { $store: { state } } });

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

  describe('on route path changes', () => {
    it('hides the search options', async() => {
      const wrapper = factory();

      await wrapper.setData({ showSearchOptions: true });
      wrapper.vm.$route.path = '/collections/newspaper';
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });
  });

  describe('when user clicks outside the search form dropdown', () => {
    it('hides the search options', async() => {
      const handleClickOrTabOutsideEvent = new Event('click');
      const wrapper = factory();

      await wrapper.setData({ showSearchOptions: true });
      wrapper.vm.handleClickOrTabOutside(handleClickOrTabOutsideEvent);

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });
  });

  describe('when user tabs outside the search form dropdown', () => {
    it('hides the search options', async() => {
      const tabOutsideEvent = new KeyboardEvent('keydown', { 'key': 'Tab' });
      const wrapper = factory();

      await wrapper.setData({ showSearchOptions: true });
      wrapper.vm.handleClickOrTabOutside(tabOutsideEvent);

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });
  });

  it('suggestions and quick search are navigable by keyboard arrows', async() => {
    const componentWithOptions = { template: '<ul><li v-for="(option, index) in [{ $el: {focus: () => {} } }, { $el: { focus: () => {} } }]" ref="options"></li></ul>' };
    const arrowDownEvent = new KeyboardEvent('keydown', { 'key': 'ArrowDown' });

    const wrapper = factory({ stubs: { SearchQueryOptions: componentWithOptions } });

    await wrapper.setData({ showSearchOptions: true, query: 't', suggestions: { suggetion01: 'trees', suggestion02: 'Tiziano' } });

    const focus0 = sinon.spy(wrapper.vm.$refs.searchoptions.$refs.options[0], 'focus');
    const focus1 = sinon.spy(wrapper.vm.$refs.searchoptions.$refs.options[1], 'focus');

    wrapper.vm.handleKeyDown(arrowDownEvent);
    expect(focus0.called).toBe(true);
    wrapper.vm.handleKeyDown({ key: 'ArrowDown', target: wrapper.vm.$refs.searchoptions.$refs.options[0], preventDefault: () => {} });
    expect(focus1.called).toBe(true);
    wrapper.vm.handleKeyDown({ key: 'ArrowUp', target: wrapper.vm.$refs.searchoptions.$refs.options[1], preventDefault: () => {} });
    expect(focus0.called).toBe(true);
  });

  it('re-shows the form when prop updates', async() => {
    const wrapper = factory({ propsData: { show: false } });

    const searchForm = wrapper.find('[data-qa="search form"]');

    expect(searchForm.isVisible()).toBe(false);

    await wrapper.setProps({ show: true });
    expect(searchForm.isVisible()).toBe(true);
  });

  describe('when pressing the Escape key', () => {
    const escapeEvent = new KeyboardEvent('keydown', { 'key': 'Escape' });

    it('hides the search options', async() => {
      const wrapper = factory({ data: { showSearchOptions: true } });

      expect(wrapper.vm.showSearchOptions).toBe(true);
      expect(wrapper.vm.showForm).toBe(true);

      await wrapper.vm.handleKeyDown(escapeEvent);

      expect(wrapper.vm.showSearchOptions).toBe(false);
    });

    it('emits hide event', async() => {
      const wrapper = factory();

      await wrapper.vm.handleKeyDown(escapeEvent);

      expect(wrapper.emitted('hide').length).toBe(1);
    });

    describe('when the search form is hidable', () => {
      it('hides it', async() => {
        const wrapper = factory({ propsData: { hidableForm: true } });

        await wrapper.vm.handleKeyDown(escapeEvent);
        const searchForm = wrapper.find('[data-qa="search form"]');

        expect(wrapper.vm.showForm).toBe(false);
        expect(searchForm.isVisible()).toBe(false);
      });
    });

    describe('when the search form is not hidable', () => {
      it('does not hide it', async() => {
        const wrapper = factory();

        await wrapper.vm.handleKeyDown(escapeEvent);
        const searchForm = wrapper.find('[data-qa="search form"]');

        expect(wrapper.vm.showForm).toBe(true);
        expect(searchForm.isVisible()).toBe(true);
      });
    });
  });

  describe('when clicking the clear button', () => {
    it('resets focus on the input', async() => {
      const wrapper = fullFactory();

      await wrapper.setData({ showSearchOptions: true, query: 'tree' });

      const clearButton = wrapper.find('[data-qa="clear button"]');

      await clearButton.trigger('click');

      const focusedSearchInput = wrapper.find('[data-qa="search box"]:focus');

      expect(focusedSearchInput.exists()).toBe(true);
    });
  });

  describe('when clicking the back button', () => {
    it('closes the search bar', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'handleHide');

      const backButton = wrapper.find('[data-qa="back button"]');
      backButton.trigger('click.prevent');

      expect(wrapper.vm.handleHide.called).toBe(true);
    });
  });
});
