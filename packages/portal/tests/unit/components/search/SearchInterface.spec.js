import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import SearchInterface from '@/components/search/SearchInterface.vue';

const localVue = createLocalVue();
localVue.filter('localise', (number) => number);
localVue.filter('truncate', (string) => string);
localVue.filter('optimisedImageUrl', (string) => string);
localVue.use(BootstrapVue);

const searchResult = {
  totalResults: 1,
  items: [
    {
      europeanaId: '/123/abc',
      dcTitle: { def: ['Record 123/abc'] },
      edmPreview: 'https://www.example.org/abc.jpg',
      edmDataProvider: ['Provider 123']
    }
  ]
};

const factory = ({ $fetchState = {}, mocks = {}, propsData = {}, data = {} } = {}) => shallowMountNuxt(SearchInterface, {
  localVue,
  mocks: {
    $t: (key) => key,
    localePath: () => '/',
    $router: { push: sinon.spy() },
    $fetchState,
    $route: { path: '/search', name: 'search', query: {} },
    $error: sinon.spy(),
    localise: (val) => val,
    ...mocks,
    $store: {
      commit: sinon.spy(),
      getters: {
        'debug/settings': { enabled: false },
        'search/activeView': 'grid',
        ...mocks.$store?.getters
      },
      state: {
        entity: {
          entity: {}
        },
        ...mocks.$store?.state
      }
    },
    $config: {
      europeana: {
        apis: {
          fulltext: {
            url: 'https://newspapers.eanadev.org/api/v2'
          }
        }
      }
    },
    $apis: {
      record: {
        search: sinon.stub().resolves(searchResult)
      }
    },
    $i18n: {
      locale: 'en'
    },
    $features: {
      advancedSearch: false
    }
  },
  propsData,
  data: () => data,
  stubs: ['SideFilters', 'i18n']
});

describe('components/search/SearchInterface', () => {
  beforeEach(() => sinon.resetHistory());

  describe('fetch', () => {
    it('activates the search in the store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.commit.calledWith('search/setActive')).toBe(true);
    });

    it('runs the search via the Record API', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.record.search.called).toBe(true);
    });

    it('stores the results', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.results).toEqual(searchResult.items);
    });

    it('handles search API errors, via $error', async() => {
      const wrapper = factory();
      process.server = true;
      wrapper.vm.$apis.record.search.throws({ statusCode: 400, message: 'Client error' });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$error.calledWith(
        { statusCode: 400, message: 'Client error' }
      )).toBe(true);
    });

    it('treats no results as an error', async() => {
      const wrapper = factory();
      wrapper.vm.$apis.record.search.resolves({ totalResults: 0 });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$error.calledWith(
        sinon.match.has('code', 'searchResultsNotFound')
      )).toBe(true);
    });

    describe('when there was a pagination error', () => {
      it('calls $error with a user-friendly error message', async() => {
        const wrapper = factory();
        process.server = true;
        wrapper.vm.$apis.record.search.throws({
          statusCode: 400,
          message: 'Sorry! It is not possible to paginate beyond the first 5000 search results.'
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.calledWith(
          sinon.match.has('code', 'searchPaginationLimitExceeded'),
          { tValues: { description: { limit: 5000 } } }
        )).toBe(true);
      });
    });

    it('scrolls to the page header element', async() => {
      const wrapper = factory();
      wrapper.vm.$scrollTo = sinon.spy();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$scrollTo.calledWith('#header')).toBe(true);
    });
  });

  describe('computed', () => {
    describe('noMoreResults', () => {
      describe('when there are 0 results in total', () => {
        const wrapper = factory({
          data: { totalResults: 0 }
        });

        it('is `false`', () => {
          expect(wrapper.vm.noMoreResults).toBe(false);
        });
      });

      describe('when there are some results in total', () => {
        describe('and results here', () => {
          const wrapper = factory({
            data: {
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
            data: {
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

          expect(wrapper.vm.$store.commit.calledWith('search/setView', view)).toBe(true);
        });
      });
    });

    describe('debugSettings', () => {
      it('reads the debug settings from the store', () => {
        const wrapper = factory({ mocks: { $store: { getters: { 'debug/settings': { enabled: false } } } } });

        expect(wrapper.vm.debugSettings).toStrictEqual({ enabled: false });
      });
    });

    describe('showSearchBoostingForm', () => {
      it('is true when the boosting toggle is enabled', () => {
        const wrapper = factory({ mocks: { $store: { getters: { 'debug/settings': { boosting: true } } } } });

        expect(wrapper.vm.showSearchBoostingForm).toBe(true);
      });

      it('is false when the boosting toggle is disabled', () => {
        const wrapper = factory();

        expect(wrapper.vm.showSearchBoostingForm).toBe(false);
      });
    });
  });

  describe('destroyed', () => {
    it('stores that the search is inactive', async() => {
      const wrapper = factory();

      await wrapper.destroy();

      expect(wrapper.vm.$store.commit.calledWith('search/setActive', false)).toBe(true);
    });
  });

  describe('methods', () => {
    describe('handlePaginationChanged', () => {
      it('is records pagination changed then triggers fetch', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, '$fetch');
        expect(wrapper.vm.paginationChanged).toBe(false);

        wrapper.vm.handlePaginationChanged();

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

    describe('setViewFromRouteQuery', () => {
      describe('with view in route query', () => {
        const route = { query: { view: 'mosaic', query: 'sport' } };

        it('updates the stored view', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.setViewFromRouteQuery();

          expect(wrapper.vm.$store.commit.calledWith('search/setView', 'mosaic')).toBe(true);
        });

        it('sets searchResultsView cookie', () => {
          const wrapper = factory({ mocks: { $route: route, $cookies: { set: sinon.spy() } } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.setViewFromRouteQuery();

          expect(wrapper.vm.$cookies.set.calledWith('searchResultsView', 'mosaic')).toBe(true);
        });
      });

      describe('without view in route query', () => {
        const route = { query: { query: 'sport' } };

        it('does not update the stored view', () => {
          const wrapper = factory({ mocks: { $route: route } });
          wrapper.setData({ view: 'list' });
          sinon.resetHistory();

          wrapper.vm.setViewFromRouteQuery();

          expect(wrapper.vm.$store.commit.called).toBe(false);
        });

        it('does not set searchResultsView cookie', () => {
          const wrapper = factory({ mocks: { $route: route, $cookies: { set: sinon.spy() } } });
          wrapper.setData({ view: 'list' });

          wrapper.vm.setViewFromRouteQuery();

          expect(wrapper.vm.$cookies.set.called).toBe(false);
        });
      });
    });

    describe('toggleAdvancedSearch', () => {
      it('toggles the advanced search display state', () => {
        const wrapper = factory();

        wrapper.vm.toggleAdvancedSearch();

        expect(wrapper.vm.showAdvancedSearch).toBe(true);
      });
    });
  });

  describe('deriveApiSettings', () => {
    it('combines userParams and overrideParams into apiParams', () => {
      const userQuery = 'calais';
      const userQf = 'TYPE:"IMAGE"';
      const userQa = [
        'proxy_dc_title:dog'
      ];
      const expectedQuery = 'calais AND proxy_dc_title:dog';
      const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/200"';
      const profile = 'minimal';
      const wrapper = factory({
        mocks: {
          $route: {
            query: {
              qa: userQa,
              query: userQuery,
              qf: userQf
            }
          }
        },
        propsData: {
          overrideParams: {
            qf: [overrideQf]
          }
        }
      });

      wrapper.vm.deriveApiSettings();

      expect(wrapper.vm.apiParams).toEqual({
        query: expectedQuery,
        qf: [userQf, overrideQf],
        profile
      });
    });

    describe('within a theme having fulltext API support', () => {
      describe('metadata/fulltext API selection', () => {
        it('applies user selection if present', () => {
          const $route = { query: { qf: ['collection:newspaper'], api: 'metadata' } };

          const wrapper = factory({
            mocks: {
              $route
            }
          });

          wrapper.vm.deriveApiSettings();

          expect(wrapper.vm.apiParams.api).toBe('metadata');
        });

        it('falls back to collection-specific default', () => {
          const $route = { query: { qf: ['collection:newspaper'] } };

          const wrapper = factory({
            mocks: {
              $route
            }
          });

          wrapper.vm.deriveApiSettings();

          expect(wrapper.vm.apiParams.api).toBe('fulltext');
        });
      });

      describe('and fulltext API is selected', () => {
        const $route = { query: { qf: ['collection:newspaper'], api: 'fulltext' } };

        it('sets profile param to "minimal,hits"', () => {
          const wrapper = factory({
            mocks: {
              $route
            }
          });

          wrapper.vm.deriveApiSettings();

          expect(wrapper.vm.apiParams.profile).toBe('minimal,hits');
        });

        it('sets fulltext API URL option', () => {
          const wrapper = factory({
            mocks: {
              $route
            }
          });

          wrapper.vm.deriveApiSettings();

          expect(wrapper.vm.apiOptions.url).toBe('https://newspapers.eanadev.org/api/v2');
        });
      });

      describe('and metadata API is selected', () => {
        const $route = { query: { qf: ['collection:newspaper'], api: 'metadata' } };

        it('does not set profile param to "minimal,hits"', () => {
          const wrapper = factory({
            mocks: {
              $route
            }
          });

          wrapper.vm.deriveApiSettings();

          expect(wrapper.vm.apiParams.profile).toBe('minimal');
        });

        it('does not set fulltext API URL option', () => {
          const wrapper = factory({
            mocks: {
              $route
            }
          });

          wrapper.vm.deriveApiSettings();

          expect(wrapper.vm.apiOptions.url).not.toBe('https://newspapers.eanadev.org/api/v2');
        });
      });
    });
  });
});
