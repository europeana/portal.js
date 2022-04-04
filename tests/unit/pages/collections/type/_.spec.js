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
    homepage: 'https://www.example-organisation.eu',
    hasAddress: {
      countryName: 'The Netherlands',
      locality: 'The Hague'
    },
    acronym: { en: 'ABC' }
  },
  type: 'organisation'
};

const topicEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/base/01234567890',
    description: { en: 'example of a topic description' },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' }
  },
  type: 'concept'
};

const themeEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/base/94',
    description: { en: 'example of a theme description' },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' }
  },
  type: 'topic'
};

const mutations = {
  setId: sinon.spy(),
  setEntity: sinon.spy(),
  setShowSearchBar: sinon.spy()
};

const store = (entity = {}) => {
  return new Vuex.Store({
    state: {
      entity: { entity },
      i18n: {
        locale: 'en'
      },
      auth: {},
      search: {
        showSearchBar: true
      }
    },
    getters: {
      'entity/curatedEntity': () => () => null,
      'search/facetNames': () => [],
      'search/filters': () => ({}),
      'search/queryUpdatesForFacetChanges': () => () => ({}),
      'search/collection': () => false
    },
    mutations: {
      'search/set': () => null,
      'search/setShowFiltersToggle': () => null,
      'search/setCollectionLabel': () => null,
      'search/setShowSearchBar': (state, val) => mutations.setShowSearchBar(val),
      'entity/setRelatedEntities': () => null,
      'entity/setId': (state, val) => mutations.setId(val),
      'entity/setEntity': (state, val) => mutations.setEntity(val) // (state, val) => state.entity.entity = val
    },
    actions: {
      'entity/searchForRecords': () => null,
      'search/setResettableFilter': () => ({})
    }
  });
};

const factory = (options) => shallowMountNuxt(collection, {
  localVue,
  store: store(options.entity),
  mocks: {
    $t: key => key,
    $tc: (key) => key,
    $te: () => true,
    $route: { query: '', params: { type: options.type, pathMatch: '190-art' } },
    $apis: {
      entity: {
        facets: sinon.stub().resolves([])
      },
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

describe('pages/collections/type/_', () => {
  describe('beforeRouteLeave', () => {
    it('resets set id and set entity', async() => {
      const to = { name: 'search__eu', fullPath: '/en/search', matched: [{ path: '/en/search' }] };
      const wrapper = factory(topicEntity);

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(mutations.setEntity.calledWith(null)).toBe(true);
      expect(mutations.setId.calledWith(null)).toBe(true);
      expect(next.called).toBe(true);
    });
    it('hides search bar when not navigating to search page', async() => {
      const to = { name: 'item___eu', fullPath: '/eu/item/123', matched: [{ path: '/eu/item/123' }] };
      const wrapper = factory(topicEntity);

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(mutations.setShowSearchBar.calledWith(false)).toBe(true);
      expect(next.called).toBe(true);
    });
  });

  describe('contextLabel', () => {
    it('returns the label for an organisation', () => {
      const wrapper = factory(organisationEntity);

      const contextLabel = wrapper.vm.contextLabel;
      expect(contextLabel).toBe('cardLabels.organisation');
    });
    it('returns the label for a theme', () => {
      const wrapper = factory(themeEntity);

      const contextLabel = wrapper.vm.contextLabel;
      expect(contextLabel).toBe('cardLabels.theme');
    });
  });

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
  describe('thumbnail', () => {
    it('returns a thumbnail when available', () => {
      const wrapper = factory(topicEntity);

      const thumbnail = wrapper.vm.thumbnail;
      expect(thumbnail).toBe(topicEntity.entity.isShownBy.thumbnail);
    });
  });
  describe('moreInfo', () => {
    it('returns an object with more entity data on organisation pages', () => {
      const wrapper = factory(organisationEntity);

      const moreInfo = wrapper.vm.moreInfo;
      expect(moreInfo[0].value).toBe(organisationEntity.entity.homepage);
      expect(moreInfo[1].value).toBe(organisationEntity.entity.hasAddress.countryName);
      expect(moreInfo[2].value).toBe(organisationEntity.entity.acronym.en);
      expect(moreInfo[3].value).toBe(organisationEntity.entity.hasAddress.locality);
    });
  });

  describe('methods', () => {
    describe('showRelatedCollections()', () => {
      it('sets showRelated to true', async() => {
        const wrapper = factory(topicEntity);

        await wrapper.vm.showRelatedCollections();

        expect(wrapper.vm.showRelated).toBe(true);
      });
    });

    describe('hideRelatedCollections()', () => {
      it('sets showRelated to true', async() => {
        const wrapper = factory(topicEntity);

        await wrapper.vm.hideRelatedCollections();

        expect(wrapper.vm.showRelated).toBe(false);
      });
    });
  });
});
