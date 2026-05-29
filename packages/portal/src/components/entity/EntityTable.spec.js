import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '@test/utils.js';
import sinon from 'sinon';
import nock from 'nock';
import BootstrapVue from 'bootstrap-vue';

import EntityTable from '@/components/entity/EntityTable.vue';
import * as backendFetchModule from '@/utils/backendFetch.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = { type: 'organisations' }) => mountNuxt(EntityTable, {
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
  stubs: ['SmartLink', 'EntityOrganisationsRelated', 'PaginationNavInput']
});

const collections = [
  {
    id: 'http://data.europeana.eu/organization/001',
    slug: '001-museum',
    prefLabel: { de: 'museum' },
    altLabel: { en: 'museum' },
    countryPrefLabel: 'Deutschland'
  },
  {
    id: 'http://data.europeana.eu/organization/002',
    slug: '002-library',
    prefLabel: { nl: 'bibliotheek' },
    altLabel: { en: 'library' },
    countryPrefLabel: 'Nederland'
  }
];

const organisations = [
  {
    id: 'http://data.europeana.eu/organization/001',
    slug: '001-museum',
    prefLabel: 'museum',
    prefLabelLang: 'de',
    altLabel: 'museum',
    altLabelLang: 'en',
    countryPrefLabel: 'Deutschland'
  },
  {
    id: 'http://data.europeana.eu/organization/002',
    slug: '002-library',
    prefLabel: 'bibliotheek',
    prefLabelLang: 'nl',
    altLabel: 'library',
    altLabelLang: 'en',
    countryPrefLabel: 'Nederland'
  }
];

describe('components/entity/EntityTable', () => {
  const backendFetch = sinon.stub(backendFetchModule, 'backendFetch')
    .resolves({ items: collections, total: collections.length });

  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
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

      expect(wrapper.vm.collections).toEqual(organisations);
    });

    describe('when there is a filter function', () => {
      it('stores filtered collections on collections property', async() => {
        const wrapper = factory({ type: 'organisations', filter: (org) => org.id.endsWith('/001') });

        await wrapper.vm.fetch();

        expect(wrapper.vm.collections.length).toBe(1);
        expect(wrapper.vm.collections[0]).toEqual(organisations[0]);
      });
    });
  });

  describe('entityRoute', () => {
    it('returns the local path', async() => {
      const wrapper = factory();

      const entityRoute = wrapper.vm.entityRoute(organisations[0].slug);

      expect(entityRoute).toBe(`/collections/organisation/${organisations[0].slug}`);
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
    it('updates the route query', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'updateRouteQuery');

      const recordCountTh = wrapper.find('.table-name-cell');
      await recordCountTh.trigger('click');

      expect(wrapper.vm.updateRouteQuery.calledWith({ sort: 'prefLabel desc', page: 1 })).toBe(true);
    });
  });
});
