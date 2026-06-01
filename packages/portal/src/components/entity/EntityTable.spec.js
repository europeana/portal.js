import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';
import nock from 'nock';

import EntityTable from './EntityTable.vue';
import { fixtures } from './EntityTable.fixtures.js';
import * as backendFetchModule from '@/utils/backendFetch.js';

const localVue = createLocalVue();

const factory = (propsData = fixtures.propsData.organisations) => shallowMountNuxt(EntityTable, {
  attachTo: document.body,
  localVue,
  propsData,
  mocks: {
    $n: (num) => num,
    $nuxt: { context: { $config: { redis: {} } } },
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $route: { query: { page: 1, query: null, sort: null } },
    $router: { push: () => {} },
    localePath: () => '/'
  },
  stubs: ['SmartLink', 'EntityOrganisationsRelated', 'PaginationNavInput', 'b-form-input', 'b-form']
});

describe('components/entity/EntityTable', () => {
  const backendFetch = sinon.stub(backendFetchModule, 'backendFetch');

  beforeAll(() => {
    nock.disableNetConnect();
  });
  beforeEach(() => {
    backendFetch.withArgs('collections', sinon.match.array, sinon.match.object)
      .resolves({ items: fixtures.backend.collections.organisations, total: fixtures.backend.collections.organisations.length });
  });
  afterEach(() => {
    sinon.resetHistory();
    sinon.resetBehavior();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('fetch()', () => {
    it('fetches collections data from the backend', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(backendFetch.calledWith(
        'collections',
        [
          'organisations',
          {
            lang: 'en',
            page: 1,
            pageSize: 40,
            query: null,
            sort: 'prefLabel asc'
          }
        ],
        wrapper.vm.$nuxt.context
      )).toBe(true);
    });

    it('stores collections from response body on component collections property', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.collections).toEqual(fixtures.frontend.organisations);
    });

    describe('when there is a filter function', () => {
      it('stores filtered collections on collections property', async() => {
        const wrapper = factory({ ...fixtures.propsData.organisations, filter: (org) => org.id.endsWith('/001') });

        await wrapper.vm.fetch();

        expect(wrapper.vm.collections.length).toBe(1);
        expect(wrapper.vm.collections[0]).toEqual(fixtures.frontend.organisations[0]);
      });
    });

    describe('when type is "organisations"', () => {
      describe('and fields includes "aggregator"', () => {
        const propsData = fixtures.propsData.organisationsWithAggregatedVia;

        beforeEach(() => {
          backendFetch.withArgs('collections', sinon.match.array, sinon.match.object)
            .resolves({
              items: fixtures.backend.collections.organisationsWithAggregatedVia,
              total: fixtures.backend.collections.organisationsWithAggregatedVia.length
            });
          backendFetch.withArgs('collections/retrieve', sinon.match.array, sinon.match.object)
            .resolves(fixtures.backend['collections/retrieve'].aggregators);
        });

        it('fetches aggregator data from the backend', async() => {
          const wrapper = factory(propsData);

          await wrapper.vm.fetch();

          expect(backendFetch.calledWith(
            'collections/retrieve',
            [
              [
                ...fixtures.backend.collections.organisationsWithAggregatedVia[0].aggregatedVia,
                ...fixtures.backend.collections.organisationsWithAggregatedVia[1].aggregatedVia
              ],
              {
                fl: 'id,prefLabel'
              }
            ],
            wrapper.vm.$nuxt.context
          )).toBe(true);
        });

        it('adds aggregator data to stored collections', async() => {
          const wrapper = factory(propsData);

          await wrapper.vm.fetch();

          expect(wrapper.vm.collections).toEqual(fixtures.frontend.organisationsWithAggregatedVia);
        });
      });
    });
  });

  describe('entityRoute', () => {
    it('returns the local path', async() => {
      const wrapper = factory();

      const entityRoute = wrapper.vm.entityRoute(fixtures.frontend.organisations[0].slug);

      expect(entityRoute).toBe(`/collections/organisation/${fixtures.frontend.organisations[0].slug}`);
    });
  });

  describe('LoadingSpinner', () => {
    it('is shown when fetch is in progress', () => {
      const wrapper = factory({ type: 'organisations' }, { pending: true });

      expect(wrapper.find('[data-qa="loading spinner"]')).toBeDefined();
    });
  });

  describe('AlertMessage', () => {
    it('is shown when fetch errors', () => {
      const wrapper = factory({ type: 'organisations' }, { error: true });

      expect(wrapper.find('[data-qa="error notice"]')).toBeDefined();
    });
  });

  describe('when the route query updates', () => {
    const newQuery = 'museum';
    it('filters the table on the query', async() => {
      const wrapper = factory();

      wrapper.vm.$route.query.query = newQuery;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.query).toEqual(newQuery);
    });
    it('calls $fetch', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, '$fetch');

      wrapper.vm.$route.query.query = newQuery;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.$fetch.called).toBe(true);
    });
  });

  describe('when the route page query updates', () => {
    it('updates the current table page', () => {
      const wrapper = factory();

      wrapper.vm.$route.query.page = 4;

      expect(wrapper.vm.currentPage).toEqual(4);
    });
    describe('when falsy value', () => {
      it('falls back to current table page 1', () => {
        const wrapper = factory();

        wrapper.vm.$route.query.page = null;

        expect(wrapper.vm.currentPage).toEqual(1);
      });
    });
  });

  describe('when the route sort query updates', () => {
    it('updates the current table sort order and field', () => {
      const wrapper = factory();
      const sortField = 'countryPrefLabel';
      const sortDirection = 'desc';

      wrapper.vm.$route.query.sort = `${sortField} ${sortDirection}`;

      expect(wrapper.vm.sortBy).toEqual(sortField);
      expect(wrapper.vm.sortDesc).toEqual(true);
    });
    describe('when falsy value', () => {
      it('falls back to sorting on the name in asc order', () => {
        const wrapper = factory();

        wrapper.vm.$route.query.sort = null;

        expect(wrapper.vm.sortBy).toEqual('prefLabel');
        expect(wrapper.vm.sortDesc).toEqual(false);
      });
    });
  });

  describe('when the table is filtered', () => {
    it('updates the route query', () => {
      const newQuery = 'museum';
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'updateRouteQuery');

      wrapper.vm.query = newQuery;
      wrapper.find('[data-qa="entity table filter"]').vm.$emit('change', newQuery);

      expect(wrapper.vm.updateRouteQuery.calledWith({ query: newQuery, page: 1 })).toBe(true);
    });
  });

  describe('when the table is sorted', () => {
    it('updates the route query', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'updateRouteQuery');

      wrapper.vm.sortBy = 'recordCount';

      expect(wrapper.vm.updateRouteQuery.calledWith({ sort: 'recordCount asc', page: 1 })).toBe(true);
    });

    describe('when a table ID is set', () => {
      it('updates the route query including it', async() => {
        const wrapper = factory({ type: 'organisations', tableId: 'aggregators' });
        sinon.spy(wrapper.vm, 'updateRouteQuery');

        const recordCountTh = wrapper.find('.table-name-cell');
        await recordCountTh.trigger('click');

        expect(wrapper.vm.updateRouteQuery.calledWith({ 'aggregators-sort': 'prefLabel desc', page: 1 })).toBe(true);
      });
    });
  });
});
