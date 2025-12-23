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
      id: '/123/abc',
      dcTitle: { def: ['Record 123/abc'] },
      edmPreview: 'https://www.example.org/abc.jpg',
      edmDataProvider: ['Provider 123']
    }
  ]
};

const logApmTransactionSpy = sinon.spy();

const factory = ({ mocks = {}, propsData = {}, data = {} } = {}) => shallowMountNuxt(SearchInterface, {
  localVue,
  attachTo: document.body,
  mocks: {
    $cookies: { get: sinon.stub(), set: sinon.spy() },
    $features: { multilingualSearch: false },
    $t: (key) => key,
    localePath: (args) => args,
    $router: { push: sinon.spy() },
    $route: { path: '/search', name: 'search', query: {} },
    $error: sinon.spy(),
    localise: (val) => val,
    $apis: {
      record: {
        search: sinon.stub().resolves(searchResult)
      },
      fulltext: {
        baseURL: 'https://api.europeana.eu/fulltext'
      }
    },
    $auth: {},
    $keycloak: { login: sinon.spy() },
    $i18n: {
      locale: 'en',
      n: (num) => num
    },
    $config: mocks.$config,
    ...mocks,
    $store: {
      commit: sinon.spy(),
      getters: {
        ...mocks.$store?.getters
      },
      state: {
        entity: {
          entity: {}
        },
        search: {
          qasWithSelectedEntityValue: []
        },
        ...mocks.$store?.state
      }
    }
  },
  propsData,
  data: () => data,
  mixins: [
    {
      methods: {
        logApmTransaction: logApmTransactionSpy
      }
    }
  ],
  stubs: ['ErrorMessage', 'SearchQueryBuilder', 'SearchFilters', 'SearchResultsContext', 'LoadingSpinner', 'i18n']
});

describe('components/search/SearchInterface', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('activates the search in the store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.commit.calledWith('search/setActive')).toBe(true);
    });

    describe('when multilingualSearch cookie is saved to true, logged in and enabled for locale', () => {
      const $auth = { loggedIn: true };
      const $config = { app: { search: { translateLocales: ['nl'] } } };
      const $features = { multilingualSearch: true };
      const $i18n = { locale: 'nl' };

      it('activates multilingual search', async() => {
        const wrapper = factory({ mocks: { $auth, $config, $features, $i18n } });
        wrapper.vm.$cookies.get.returns(true);

        await wrapper.vm.fetch();

        expect(wrapper.vm.translate).toBe(true);
      });
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

    it('displays no results like an error', async() => {
      const wrapper = factory();
      wrapper.vm.$apis.record.search.resolves({ totalResults: 0 });

      await wrapper.vm.fetch();
      const errorMessageStub = wrapper.find('errormessage-stub');

      expect(errorMessageStub.isVisible()).toBe(true);
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
      process.client = true;
      wrapper.vm.scrollToSelector = sinon.spy();

      await wrapper.vm.fetch();

      expect(wrapper.vm.scrollToSelector.calledWith('#header')).toBe(true);
    });

    it('logs the search interaction to APM', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'logApmTransaction');
      wrapper.vm.$route.query = {
        query: 'sponge',
        qf: ['TYPE:"IMAGE"'],
        reusability: 'open'
      };

      await wrapper.vm.fetch();

      expect(wrapper.vm.logApmTransaction.calledWith({
        name: 'Search - fetch results',
        labels: {
          'search_params_query': 'sponge',
          'search_params_qf': ['TYPE:"IMAGE"', 'contentTier:(1 OR 2 OR 3 OR 4)'],
          'search_params_reusability': 'open',
          'search_results_total': 1
        }
      })).toBe(true);
    });

    describe('when advanced search queries have been enriched with entities', () => {
      describe('and the advanced search query is cleared', () => {
        it('removes the entity enriched advanced search field query', async() => {
          const wrapper = factory({ data: {
            qasWithAddedEntityValue: [{
              qa: {
                field: 'proxy_dc_date',
                modifier: 'contains',
                suggestEntityType: 'timespan',
                term: '19th century'
              },
              qae: 'proxy_dc_date:"http://data.europeana.eu/timespan/19"'
            }]
          } });

          wrapper.vm.$route.query = {
            qa: []
          };

          await wrapper.vm.fetch();

          expect(wrapper.vm.qasWithAddedEntityValue).toEqual([]);
        });
      });
    });

    describe('when there are advanced search fields applied', () => {
      describe('and they require an entity look up', () => {
        describe('and a matching entity is found', () => {
          it('adds the matched entity as an additional field to look up', async() => {
            const expectedAdvancedQuery = 'proxy_dc_date:((19th century) OR "http://data.example.eu/123")';
            const wrapper = factory({ mocks: {
              $apis: {
                entity: {
                  suggest: sinon.stub().resolves([{ id: 'http://data.example.eu/123', prefLabel: { en: '19th century' } }])
                }
              },
              $route: { path: '/search', name: 'search', query: { qa: ['proxy_dc_date:19th\\ century'] } }
            } });

            await wrapper.vm.fetch();

            expect(wrapper.vm.qaes.length).toBe(1);
            expect(wrapper.vm.qaes[0]).toEqual(expectedAdvancedQuery);
          });
        });

        describe('and there is no matching entity', () => {
          it('saves the query anyway', async() => {
            const wrapper = factory({ mocks: {
              $apis: {
                entity: {
                  suggest: sinon.stub().resolves([])
                }
              },
              $route: { path: '/search', name: 'search', query: { qa: ['proxy_dc_date:2023'] } }
            } });

            await wrapper.vm.fetch();

            expect(wrapper.vm.qaes.length).toBe(0);
            expect(wrapper.vm.qasWithAddedEntityValue.length).toBe(1);
            expect(wrapper.vm.qasWithAddedEntityValue[0].qae).toEqual(null);
          });
        });
      });
    });

    describe('interaction logging', () => {
      describe('when server-side', () => {
        beforeAll(() => {
          process.server = true;
          process.client = false;
        });
        afterAll(() => {
          delete process.server;
          delete process.client;
        });

        it('logs the interaction to APM', async() => {
          const wrapper = factory();
          sinon.resetHistory();

          await wrapper.vm.fetch();

          expect(logApmTransactionSpy.calledWith({
            name: 'Search - fetch results',
            labels: { 'search_params_qf': ['contentTier:(1 OR 2 OR 3 OR 4)'], 'search_results_total': 1 }
          })).toBe(true);
        });

        it('resets the stored loggable interaction flag', async() => {
          const wrapper = factory();
          sinon.resetHistory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', false)).toBe(true);
        });
      });

      describe('when client-side', () => {
        beforeAll(() => {
          process.server = false;
          process.client = true;
        });
        afterAll(() => {
          delete process.server;
          delete process.client;
        });

        describe('and interaction is flagged as loggable in the store', () => {
          const mocks = { $store: { state: { search: { loggableInteraction: true } } } };
          it('logs the interaction to APM', async() => {
            const wrapper = factory({ mocks });
            sinon.resetHistory();

            await wrapper.vm.fetch();

            expect(logApmTransactionSpy.calledWith({
              name: 'Search - fetch results',
              labels: { 'search_params_qf': ['contentTier:(1 OR 2 OR 3 OR 4)'], 'search_results_total': 1 }
            })).toBe(true);
          });

          it('resets the stored loggable interaction flag', async() => {
            const wrapper = factory({ mocks });
            sinon.resetHistory();

            await wrapper.vm.fetch();

            expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', false)).toBe(true);
          });
        });

        describe('but interaction is not flagged as loggable in the store', () => {
          const mocks = { $store: { state: { search: { loggableInteraction: false } } } };

          it('does not record the interaction', async() => {
            const wrapper = factory({ mocks });
            sinon.resetHistory();

            await wrapper.vm.fetch();

            expect(logApmTransactionSpy.called).toBe(false);
          });
        });
      });
    });
  });

  describe('computed', () => {
    describe('apiOptions', () => {
      describe('translateLang', () => {
        const $i18n = { locale: 'nl' };

        describe('when translate is not enabled', () => {
          const data = { translate: false };

          it('is not defined', () => {
            const wrapper = factory({ data, mocks: { $i18n } });

            const translateLang = wrapper.vm.apiOptions.translateLang;

            expect(translateLang).toBeUndefined();
          });
        });

        describe('when translate is enabled', () => {
          const data = { translate: true };

          it('returns the current locale', () => {
            const wrapper = factory({ data, mocks: { $i18n } });

            const translateLang = wrapper.vm.apiOptions.translateLang;

            expect(translateLang).toBe('nl');
          });
        });
      });
    });

    describe('advancedSearchQueryCount', () => {
      describe('when there is no advanced search query', () => {
        const route = { query: {} };

        const wrapper = factory({ mocks: { $route: route } });

        it('is undefined', () => {
          expect(wrapper.vm.advancedSearchQueryCount).toBe(0);
        });
      });
      describe('when there is one advanced search query', () => {
        const route = { query: { qa: ['proxy_dc_title:The'] } };

        const wrapper = factory({ mocks: { $route: route } });

        it('is 1', () => {
          expect(wrapper.vm.advancedSearchQueryCount).toBe(1);
        });
      });
      describe('when there are multiple advanced search queries', () => {
        const route = { query: { qa: ['proxy_dc_title:The', 'proxy_dc_title:Practice', 'proxy_dc_title:of'] } };

        const wrapper = factory({ mocks: { $route: route } });

        it('is 3', () => {
          expect(wrapper.vm.advancedSearchQueryCount).toBe(3);
        });
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
    describe('deriveApiParams', () => {
      it('combines user params and overrides', () => {
        const $route = {
          query: {
            page: 2,
            query: 'calais',
            qf: 'TYPE:"IMAGE"',
            qa: [
              'proxy_dc_title:dog'
            ]
          }
        };
        const overrideQf = 'edm_agent:"http://data.europeana.eu/agent/200"';
        const expected = {
          page: 2,
          profile: 'minimal',
          query: 'calais AND proxy_dc_title:dog',
          qf: [
            'edm_agent:"http://data.europeana.eu/agent/200"',
            'TYPE:"IMAGE"',
            'contentTier:(1 OR 2 OR 3 OR 4)'
          ],
          rows: 24
        };

        const wrapper = factory({
          mocks: {
            $route
          },
          propsData: {
            defaultParams: {
              qf: [overrideQf]
            }
          }
        });
        wrapper.vm.deriveApiParams();

        expect(wrapper.vm.apiParams).toEqual(expected);
      });

      describe('with full-text advanced search rule', () => {
        it('is promoted into query, with profile hits', () => {
          const $route = {
            query: {
              query: 'liberty',
              qa: [
                'fulltext:europe',
                'NOT fulltext:united'
              ]
            }
          };
          const expected = {
            page: 1,
            profile: 'minimal,hits',
            query: 'fulltext:europe AND NOT fulltext:united AND text:(liberty)',
            qf: ['contentTier:(1 OR 2 OR 3 OR 4)'],
            rows: 24
          };

          const wrapper = factory({
            mocks: {
              $route
            }
          });
          wrapper.vm.deriveApiParams();

          expect(wrapper.vm.apiParams).toEqual(expected);
        });
      });
    });

    describe('handleMultilingualButtonInput', () => {
      it('stores the value in the multilingualSearch cookie', () => {
        const $auth = { loggedIn: true };
        const wrapper = factory({ mocks: { $auth } });

        wrapper.vm.handleMultilingualButtonInput(true);

        expect(wrapper.vm.$cookies.set.calledWith('multilingualSearch', true)).toBe(true);
      });

      it('updates the route, resetting pagination', () => {
        const $auth = { loggedIn: true };
        const $route = { query: { query: 'casa', page: 2 } };
        const wrapper = factory({ mocks: { $auth, $route } });

        wrapper.vm.handleMultilingualButtonInput(true);

        expect(wrapper.vm.$router.push.calledWith({
          name: 'search', query: { query: 'casa', page: 1, translate: 'true' }
        })).toBe(true);
      });

      it('logs in if needed', () => {
        const $auth = { loggedIn: false };
        const wrapper = factory({ mocks: { $auth } });

        wrapper.vm.handleMultilingualButtonInput(true);

        expect(wrapper.vm.$keycloak.login.called).toBe(true);
      });
    });

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

    describe('onClickItem', () => {
      it('logs the interaction to APM', async() => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, 'logApmTransaction');
        wrapper.vm.$route.query = {
          query: 'sponge',
          qf: ['TYPE:"IMAGE"'],
          reusability: 'open'
        };
        await wrapper.vm.$fetch();
        wrapper.vm.logApmTransaction.resetHistory();

        await wrapper.vm.onClickItem(searchResult.items[0].id);

        expect(wrapper.vm.logApmTransaction.calledWith({
          name: 'Search - click result',
          labels: {
            'search_params_query': 'sponge',
            'search_params_qf': ['TYPE:"IMAGE"', 'contentTier:(1 OR 2 OR 3 OR 4)'],
            'search_params_reusability': 'open',
            'search_result_rank': 1,
            'search_results_total': 1
          }
        })).toBe(true);
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

    describe('handleSearchParamsChanged', () => {
      it('resets multi selected items and calls fetch', () => {
        const wrapper = factory();
        sinon.spy(wrapper.vm, '$fetch');
        wrapper.vm.clearSelectedItems = sinon.spy();

        wrapper.vm.handleSearchParamsChanged();

        expect(wrapper.vm.clearSelectedItems.calledWith()).toBe(true);
        expect(wrapper.vm.$fetch.called).toBe(true);
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
  });

  describe('watch', () => {
    describe('when $route.query.translate value changes', () => {
      it('clears selected items and triggers $fetch', async() => {
        const wrapper = factory({ mocks: { $route: { query: {} } } });
        sinon.spy(wrapper.vm, '$fetch');
        wrapper.vm.clearSelectedItems = sinon.spy();

        wrapper.vm.$route.query = { translate: 'true' };
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.clearSelectedItems.calledWith()).toBe(true);
        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });
});
