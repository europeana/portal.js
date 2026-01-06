import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchForm from '@/components/search/SearchForm.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const localePath = sinon.stub();
localePath.withArgs({ name: 'search' }).returns('/search');

const factory = ({ propsData, data, stubs, mocks } = {}) => shallowMount(SearchForm, {
  attachTo: document.body,
  localVue,
  propsData: {
    parent: propsData ? propsData.parent : 'page-header',
    ...propsData
  },
  data: () => (data || {}),
  stubs: { ...stubs },
  mocks: {
    $features: {},
    $i18n: { locale: 'en' },
    $t: () => {},
    $route: { path: '', query: { query: '' } },
    $router: { push: sinon.spy() },
    localePath,
    $matomo: {
      trackEvent: sinon.spy()
    },
    ...(mocks || {}),
    $store: {
      commit: sinon.spy(),
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

describe('components/search/SearchForm', () => {
  afterEach(sinon.resetHistory);

  describe('wrapper', () => {
    describe('on focusin event', () => {
      const event = 'focusin';

      it('makes the click outside handler active', async() => {
        const wrapper = factory();

        await wrapper.trigger(event);

        expect(wrapper.vm.clickOutsideConfig.isActive).toBe(true);
      });
    });
  });

  describe('initQuery', () => {
    it('sets the query read from the route', () => {
      const value = 'cartography';
      const wrapper = factory({
        mocks: {
          $route: {
            query: {
              query: value
            }
          }
        }
      });
      expect(wrapper.vm.$store.commit.calledWith('search/setQueryInputValue', value)).toBe(true);
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
          localePath,
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

    it('makes the click outside handler inactive', async() => {
      const wrapper = factory();
      await wrapper.trigger('focusin');
      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(true);

      wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(false);
    });

    describe('when on a search page', () => {
      const state = {
        search: {
          active: true,
          queryInputValue: query,
          view: 'grid'
        }
      };

      it('stores that the interaction is loggable', () => {
        const wrapper = factory({ mocks: { $store: { state } } });

        wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

        expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
      });

      it('updates current route', async() => {
        const wrapper = factory({ mocks: { $store: { state } } });

        wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

        const newRouteParams = {
          path: wrapper.vm.$route.path,
          query: { query, page: 1, view: state.search.view }
        };
        expect(wrapper.vm.$router.push.calledWith(newRouteParams)).toBe(true);
      });

      describe('when query is blank', () => {
        it('includes empty query param', async() => {
          state.search.queryInputValue = undefined;
          const wrapper = factory({ mocks: { $store: { state } } });

          wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

          const newRouteParams = {
            path: wrapper.vm.$route.path,
            query: { query: '', page: 1, view: state.search.view }
          };
          expect(wrapper.vm.$router.push.calledWith(newRouteParams)).toBe(true);
        });
      });

      describe('when selected option contains a link', () => {
        it('navigates to the link', async() => {
          const wrapper = factory({ mocks: { $store: { state } } });

          const link = 'http://www.example.eu';

          await wrapper.setData({
            selectedOption: { link }
          });
          wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

          expect(wrapper.vm.$router.push.calledWith(link)).toBe(true);
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
            active: false,
            queryInputValue: query
          }
        }
      };
      it('reroutes to search', async() => {
        const wrapper = factory({ mocks: { $store } });

        wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: $store.getters['search/activeView'] }
        };
        expect(wrapper.vm.$router.push.calledWith(newRouteParams)).toBe(true);
      });

      it('does not carry non-search query params', async() => {
        const wrapper = factory({ mocks: { $store, $route: { query: { lang: 'it' } } } });

        wrapper.find('[data-qa="search form"]').trigger('submit.prevent');

        const newRouteParams = {
          path: '/search',
          query: { query, page: 1, view: $store.getters['search/activeView'] }
        };
        expect(wrapper.vm.$router.push.calledWith(newRouteParams)).toBe(true);
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

  describe('on searchable page changes', () => {
    describe('with an input query value', () => {
      it('blurs the input', async() => {
        const wrapper = factory({ mocks: { $route: { query: { query: 'art' } }, $store: { state: { search: { active: false } } } } });
        wrapper.vm.blurInput = sinon.spy();

        wrapper.vm.$store.state.search.active = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.blurInput.called).toBe(true);
      });
    });
  });

  it('re-shows the form when prop updates', async() => {
    const wrapper = factory({ propsData: { show: false } });

    const searchForm = wrapper.find('[data-qa="search form"]');

    expect(searchForm.isVisible()).toBe(false);

    await wrapper.setProps({ show: true });
    expect(searchForm.isVisible()).toBe(true);
  });

  describe('handlehide()', () => {
    describe('when the search form is hidable', () => {
      it('hides it', async() => {
        const wrapper = factory({ propsData: { hidableForm: true }, data: { showSearchOptions: true } });

        await wrapper.vm.handleHide();
        const searchForm = wrapper.find('[data-qa="search form"]');

        expect(wrapper.vm.showForm).toBe(false);
        expect(searchForm.isVisible()).toBe(false);
      });
    });

    describe('when the search form is not hidable', () => {
      it('does not hide it', async() => {
        const wrapper = factory();

        await wrapper.vm.handleHide();
        const searchForm = wrapper.find('[data-qa="search form"]');

        expect(wrapper.vm.showForm).toBe(true);
        expect(searchForm.isVisible()).toBe(true);
      });
    });
  });

  describe('when clicking the clear button', () => {
    const focusStub = { focus: sinon.spy() };
    const buttonRef = { $el: sinon.stub().returns([focusStub]) };
    it('resets focus on the input', async() => {
      const wrapper = factory({ mocks: { $refs: [buttonRef] } });

      await wrapper.setData({ showSearchOptions: true  });
      wrapper.vm.query = 'tree';

      const clearButton = wrapper.find('[data-qa="clear button"]');

      await clearButton.trigger('click');

      expect(focusStub.focus.called).toBe(false);
    });

    describe('and on a searchable page', () => {
      it('submits the form', async() => {
        const state = {
          search: {
            active: true,
            queryInputValue: 'art'
          }
        };
        const wrapper = factory({ mocks: { $store: { state } } });
        sinon.spy(wrapper.vm, 'submitForm');

        const clearButton = wrapper.find('[data-qa="clear button"]');
        await clearButton.trigger('click');

        expect(wrapper.vm.submitForm.called).toBe(true);
      });
    });
  });

  describe('when clicking the back button', () => {
    it('closes the search bar', async() => {
      const wrapper = factory({ propsData: { hidableForm: true, parent: 'page-header' }, data: { showSearchOptions: true } });

      const backButton = wrapper.find('[data-qa="back button"]');
      await backButton.trigger('click.prevent');

      expect(wrapper.vm.showForm).toBe(false);
    });
  });

  describe('when selecting an option', () => {
    it('calls submitForm', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'submitForm');

      const searchFormOptions = wrapper.find(`#${wrapper.vm.searchFormOptionsId}`);
      await searchFormOptions.vm.$emit('input', { query: 'fish' });

      expect(wrapper.vm.submitForm.called).toBe(true);
    });
  });
});
