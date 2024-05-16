import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import SearchInterface from '@/components/search/SearchInterface.vue';

const localVue = createLocalVue();
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

const factory = ({ $fetchState = {}, mocks = {}, propsData = {}, data = {} } = {}) => shallowMountNuxt(SearchInterface, {
  localVue,
  attachTo: document.body,
  mocks: {
    $t: (key) => key,
    localePath: () => '/',
    $router: { push: sinon.spy() },
    $fetchState,
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
    $i18n: {
      locale: 'en',
      n: (num) => num
    },
    $config: mocks.$config,
    ...mocks,
    $store: {
      commit: sinon.spy(),
      getters: {
        'search/activeView': 'grid',
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
  stubs: ['SearchFilters', 'i18n']
});

describe('components/search/SearchInterface', () => {
  afterEach(sinon.resetHistory);

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
            const wrapper = factory({ mocks: { $apis: {
              entity: {
                suggest: sinon.stub().resolves([{ id: 'http://data.example.eu/123', prefLabel: { en: '19th century' } }])
              }
            } } });

            wrapper.vm.$route.query = {
              qa: ['proxy_dc_date:19th\\ century']
            };

            await wrapper.vm.fetch();

            expect(wrapper.vm.qaes.length).toBe(1);
          });
        });

        describe('and there is no matching entity', () => {
          it('saves the query anwyay', async() => {
            const wrapper = factory({ mocks: { $apis: {
              entity: {
                suggest: sinon.stub().resolves([])
              }
            } } });

            wrapper.vm.$route.query = {
              qa: ['proxy_dc_date:2023']
            };

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
      test.todo('fulltext url');
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
                  id: '/123/abc',
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
          query: 'calais',
          qf: [
            'TYPE:"IMAGE"',
            'proxy_dc_title:dog',
            'contentTier:(1 OR 2 OR 3 OR 4)',
            'edm_agent:"http://data.europeana.eu/agent/200"'
          ],
          rows: 24
        };

        const wrapper = factory({
          mocks: {
            $route
          },
          propsData: {
            overrideParams: {
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
            query: 'fulltext:europe AND NOT fulltext:united',
            qf: ['text:(liberty)', 'contentTier:(1 OR 2 OR 3 OR 4)'],
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

      describe('translation', () => {
        describe('when locales to translate are configured', () => {
          const $config = { app: { search: { translateLocales: ['nl'] } } };

          describe('and current locale is one of the configured locales to translate', () => {
            const $i18n = { locale: 'nl' };

            describe('and user is logged in', () => {
              const $auth = { loggedIn: true };

              it('configures the parameters for search translation', () => {
                const wrapper = factory({ mocks: { $auth, $config, $i18n } });
                wrapper.vm.deriveApiParams();

                const params = wrapper.vm.apiParams;

                expect(params.profile).toBe('minimal,translate');
                expect(params.lang).toBe('nl');
                expect(params['q.source']).toBe('nl');
                expect(params['q.target']).toBe('en');
              });
            });

            describe('but user is not logged in', () => {
              const $auth = { loggedIn: false };

              it('does not configure the parameters for search translation', () => {
                const wrapper = factory({ mocks: { $auth, $config, $i18n } });
                wrapper.vm.deriveApiParams();

                const params = wrapper.vm.apiParams;

                expect(params.profile).toBe('minimal');
                expect(params.lang).toBeUndefined();
                expect(params['q.source']).toBeUndefined();
                expect(params['q.target']).toBeUndefined();
              });
            });
          });

          describe('but current locale is not one of the configured locales to translate', () => {
            const $i18n = { locale: 'fr' };

            it('does not configure the parameters for search translation', () => {
              const wrapper = factory({ mocks: { $config, $i18n } });
              wrapper.vm.deriveApiParams();

              const params = wrapper.vm.apiParams;

              expect(params.profile).toBe('minimal');
              expect(params.lang).toBeUndefined();
              expect(params['q.source']).toBeUndefined();
              expect(params['q.target']).toBeUndefined();
            });
          });
        });

        describe('when locales to translate are not configured', () => {
          const $config = { app: { search: { translateLocales: [] } } };

          it('does not configure the parameters for search translation', () => {
            const wrapper = factory({ mocks: { $config } });
            wrapper.vm.deriveApiParams();

            const params = wrapper.vm.apiParams;

            expect(params.profile).toBe('minimal');
            expect(params.lang).toBeUndefined();
            expect(params['q.source']).toBeUndefined();
            expect(params['q.target']).toBeUndefined();
          });
        });
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
  });
});
