import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import OrganisationsTable from '@/components/entity/OrganisationsTable.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $axiosGetStub = sinon.stub();

const factory = (propsData = {}, errorFetchState = false, pendingFetchState = false) => mountNuxt(OrganisationsTable, {
  localVue,
  propsData,
  mocks: {
    $fetchState: {
      error: errorFetchState,
      pending: pendingFetchState
    },
    $axios: {
      get: $axiosGetStub
    },
    $t: (val) => val,
    $i18n: { locale: 'en' },
    $path: (code) => `/collections/${code.params.type}/${code.params.pathMatch}`
  }
});

const middlewarePath = '/_api/entities/organisations';
const organisations = [
  { id: '001', slug: '001-museum', prefLabel: 'museum' },
  { id: '002', slug: '002-library', prefLabel: 'library' }
];

describe('components/entity/OrganisationsTable', () => {
  describe('fetch()', () => {
    beforeEach(() => {
      $axiosGetStub.withArgs(middlewarePath).resolves({ data: organisations });
    });

    afterEach(() => {
      $axiosGetStub.reset();
    });

    it('sends a get request to the organisations server middleware', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      $axiosGetStub.should.have.been.calledWith(middlewarePath);
    });

    it('stores organisations from response body on component organisations property', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      wrapper.vm.organisations.should.deep.eq(organisations);
    });
  });

  describe('entityRoute', () => {
    it('returns an object to set the relative path', async() => {
      const wrapper = factory();

      await wrapper.setData({
        organisations
      });

      wrapper.find('[data-qa="organisation link 001"]').attributes('to').should.eq((`/collections/organisation/${organisations[0].slug}`));
    });
  });

  describe('LoadingSpinner', () => {
    it('is shown when fetch is in progress', () => {
      const wrapper = factory({ pendingFetchState: true });

      wrapper.find('[data-qa="loading spinner"]').should.exist;
    });
  });

  describe('AlertMessage', () => {
    it('is shown when fetch errors', () => {
      const wrapper = factory({ errorFetchState: true });

      wrapper.find('[data-qa="error notice"]').should.exist;
    });
  });
});
