import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import nock from 'nock';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';

import OrganisationsTable from '../../../../src/components/entity/OrganisationsTable.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}, errorFetchState = false, pendingFetchState = false) => mountNuxt(OrganisationsTable, {
  localVue,
  propsData,
  mocks: {
    $fetchState: {
      error: errorFetchState,
      pending: pendingFetchState
    },
    $axios: axios,
    $t: (val) => val,
    $i18n: { locale: 'en' },
    $path: (code) => `/collections/${code.params.type}/${code.params.pathMatch}`
  }
});

describe('components/entity/OrganisationsTable', () => {
  const baseUrl = 'http://www.example.eu';
  const middlewarePath = '/_api/entities/organisations?locale=en';
  const organisationsArray =
[{ id: '001', slug: '001-museum', prefLabel: 'museum' },
  { id: '002', slug: '002-library', prefLabel: 'library' }];
  describe('fetch()', () => {
    beforeEach(() => {
      nock(baseUrl)
        .get(middlewarePath)
        .reply(200, organisationsArray);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('sends a get request to the organisations server middleware', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch(baseUrl);

      nock.isDone().should.be.true;
    });

    it('stores organisations from response body on component organisations property', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch(baseUrl);

      nock.isDone().should.be.true;

      wrapper.vm.organisations.should.deep.eq(organisationsArray);
    });
  });

  describe('entityRoute', () => {
    it('returns an object to set the relative path', () => {
      const wrapper = factory();

      wrapper.setData({
        organisations: organisationsArray
      });

      wrapper.find('[data-qa="organisation link 001"]').attributes('href').should.eq((`/collections/organisation/${organisationsArray[0].slug}`));
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
