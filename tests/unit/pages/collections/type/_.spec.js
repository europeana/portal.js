import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import collection from '@/pages/collections/_type/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const organisationEntity = {
  entity: {
    id: 'http://data.europeana.eu/organization/01234567890',
    logo: { id: 'http://commons.wikimedia.org/wiki/Special:FilePath/Albertina%20Logo.svg' },
    description: { en: 'example of an organisation description' },
    homepage: 'https://www.example-organisation.eu'
  },
  type: 'organisation'
};

const store = (entity = {}) => {
  return new Vuex.Store({
    state: {
      entity: { entity },
      i18n: {
        locale: 'en'
      },
      auth: {},
      search: {}
    },
    getters: {
      'entity/curatedEntity': () => () => null,
      'search/facetNames': () => [],
      'search/filters': () => {},
      'search/queryUpdatesForFacetChanges': () => () => {},
      'search/collection': () => false
    },
    mutations: {
      'search/set': () => null,
      'search/setShowFiltersToggle': () => null,
      'search/setCollectionLabel': () => null
    },
    actions: {
      'entity/searchForRecords': () => null
    }
  });
};

const factory = (options) => shallowMountNuxt(collection, {
  localVue,
  store: store(options.entity),
  mocks: {
    $t: key => key,
    $route: { query: '', params: { type: options.type } },
    $apis: {
      record: {
        relatedEntities: sinon.stub().resolves({})
      }
    },
    $i18n: {
      locale: 'en'
    },
    $features: { sideFilters: false }
  }
});

describe('Collection page', () => {
  describe('collectionType', () => {
    it('returns the collection type', () => {
      const wrapper = factory(organisationEntity);

      const collectionType = wrapper.vm.collectionType;
      expect(collectionType).toBe('organisation');
    });
  });
  describe('logo', () => {
    it('returns a logo on organisation pages', () => {
      const wrapper = factory(organisationEntity);

      const logo = wrapper.vm.logo;
      expect(logo).toBe(organisationEntity.entity.logo.id);
    });
  });
  describe('description', () => {
    it('returns a description for an organisation when provided', () => {
      const wrapper = factory(organisationEntity);

      const description = wrapper.vm.description.values[0];
      expect(description).toBe(organisationEntity.entity.description.en);
    });
  });
  describe('homepage', () => {
    it('returns a homepage on organisation pages', () => {
      const wrapper = factory(organisationEntity);

      const homepage = wrapper.vm.homepage;
      expect(homepage).toBe(organisationEntity.entity.homepage);
    });
  });
});
