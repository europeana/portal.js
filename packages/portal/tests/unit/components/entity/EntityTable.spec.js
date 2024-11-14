import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import EntityTable from '@/components/entity/EntityTable.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $axiosGetStub = sinon.stub();

const factory = (propsData = { type: 'organisations' }) => mountNuxt(EntityTable, {
  localVue,
  propsData,
  mocks: {
    $axios: {
      get: $axiosGetStub
    },
    $n: (num) => num,
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $route: { query: { page: 1, filter: null, sort: null } },
    $router: { push: () => {} },
    localePath: () => '/'
  },
  stubs: ['SmartLink']
});

const middlewarePath = '/_api/cache/en/collections/organisations';
const collections = [
  { slug: '001-museum', prefLabel: { de: 'museum', en: 'museum' }, countryPrefLabel: 'Deutschland' },
  { slug: '002-library', prefLabel: { nl: 'bibliotheek', en: 'library' }, countryPrefLabel: 'Nederland' }
];

const organisations = [
  {
    slug: '001-museum',
    prefLabel: 'museum',
    prefLabelLang: 'de',
    altLabel: 'museum',
    altLabelLang: 'en',
    countryPrefLabel: 'Deutschland'
  },
  {
    slug: '002-library',
    prefLabel: 'bibliotheek',
    prefLabelLang: 'nl',
    altLabel: 'library',
    altLabelLang: 'en',
    countryPrefLabel: 'Nederland'
  }
];

describe('components/entity/EntityTable', () => {
  describe('fetch()', () => {
    beforeEach(() => {
      $axiosGetStub.withArgs(middlewarePath).resolves({ data: { 'en/collections/organisations': collections } });
    });

    afterEach(() => {
      $axiosGetStub.reset();
    });

    it('sends a get request to the collections server middleware', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect($axiosGetStub.calledWith(middlewarePath)).toBe(true);
    });

    it('stores collections from response body on component collections property', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.collections).toEqual(organisations);
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

      wrapper.vm.$route.query.filter = newQuery;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.filter).toEqual(newQuery);
    });
    it('resets the page to 1', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'updateRouteQuery');

      wrapper.vm.$route.query.filter = newQuery;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.updateRouteQuery.calledWith({ page: 1 })).toBe(true);
    });
  });

  describe('when the route page query updates', () => {
    it('updates the current table page', async() => {
      const wrapper = factory();

      wrapper.vm.$route.query.page = 4;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentPage).toEqual(4);
    });
    describe('when falsy value', () => {
      it('falls back to current table page 1', async() => {
        const wrapper = factory();

        wrapper.vm.$route.query.page = null;
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.currentPage).toEqual(1);
      });
    });
  });

  describe('when the route sort query updates', () => {
    it('updates the current table sort order and field', async() => {
      const wrapper = factory();
      const sortField = 'countryPrefLabel';
      const sortDirection = 'desc';

      wrapper.vm.$route.query.sort = `${sortField} ${sortDirection}`;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.sortBy).toEqual(sortField);
      expect(wrapper.vm.sortDesc).toEqual(true);
    });
    describe('when falsy value', () => {
      it('falls back to sorting on the name in asc order', async() => {
        const wrapper = factory();

        wrapper.vm.$route.query.sort = null;
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.sortBy).toEqual('prefLabel');
        expect(wrapper.vm.sortDesc).toEqual(false);
      });
    });
  });

  describe('when the table is filtered', () => {
    it('updates the route query', async() => {
      const newQuery = 'museum';
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'updateRouteQuery');

      wrapper.find('[data-qa="entity table filter"]').setValue(newQuery);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.updateRouteQuery.calledWith({ filter: newQuery })).toBe(true);
    });
  });

  describe('when the table is sorted', () => {
    it('updates the route query', async() => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'updateRouteQuery');

      const recordCountTh = wrapper.find('[aria-colindex="3"]');
      await recordCountTh.trigger('click');

      expect(wrapper.vm.updateRouteQuery.calledWith({ sort: 'recordCount asc' })).toBe(true);
    });
  });
});
