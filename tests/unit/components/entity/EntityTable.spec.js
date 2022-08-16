import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import EntityTable from '@/components/entity/EntityTable.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $axiosGetStub = sinon.stub();

const factory = (propsData = { type: 'organisations' }, fetchState = { error: false, pending: false }) => mountNuxt(EntityTable, {
  localVue,
  propsData,
  mocks: {
    $fetchState: fetchState,
    $axios: {
      get: $axiosGetStub
    },
    $t: (val) => val,
    $i18n: { locale: 'en' },
    $path: (code) => `/collections/${code.params.type}/${code.params.pathMatch}`
  }
});

const middlewarePath = '/_api/cache/collections/organisations';
const collections = [
  { id: '001', slug: '001-museum', prefLabel: { de: 'museum' } },
  { id: '002', slug: '002-library', prefLabel: { nl: 'bibliotheek', en: 'library' } }
];

describe('components/entity/EntityTable', () => {
  describe('fetch()', () => {
    beforeEach(() => {
      $axiosGetStub.withArgs(middlewarePath).resolves({ data: collections });
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

      expect(wrapper.vm.collections).toEqual([
        { id: '001', slug: '001-museum', prefLabel: 'museum', englishLabel: null },
        { id: '002', slug: '002-library', prefLabel: 'bibliotheek', englishLabel: 'library' }
      ]);
    });

    it('switches sorting off for organisations', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      expect(wrapper.vm.fields[0].sortable).toBe(false);
    });
  });

  describe('entityRoute', () => {
    it('returns an object to set the relative path', async() => {
      const wrapper = factory();

      await wrapper.setData({
        collections
      });

      expect(wrapper.find('[data-qa="collection link 001-museum"]').attributes('href')).toBe(`/collections/organisation/${collections[0].slug}`);
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
});
