import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/item/_';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const item = {
  identifier: '/123/abc',
  coreFields: {
    edmDataProvider: {
      url: 'https://www.example.eu',
      value: ['Data Provider']
    }
  }
};

const itemSetRelatedEntities = sinon.spy();
const store = new Vuex.Store({
  state: {
    item: {
      active: false,
      annotations: [],
      relatedEntities: [],
      similarItems: []
    }
  },
  mutations: {
    'item/setRelatedEntities': itemSetRelatedEntities
  },
  getters: {
    'entity/isPinned': () => () => false,
    'http/canonicalUrl': () => () => null,
    'set/isLiked': () => () => null,
    'item/annotationsByMotivation': () => () => null
  },
  actions: {
    'item/reset': () => null
  }
});

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return item;
  },
  stubs: ['client-only'],
  mocks: {
    $features: {},
    $pageHeadTitle: key => key,
    $route: {
      query: {}
    },
    $t: key => key,
    $i18n: {
      locale: 'en'
    },
    $auth: {
      loggedIn: false
    },
    $apis: {
      annotation: {
        search: sinon.spy()
      },
      entity: {
        find: sinon.spy()
      },
      record: {
        getRecord: sinon.stub().resolves({}),
        search: sinon.spy()
      }
    }
  },
  store
});

describe('pages/item/_.vue', () => {
  afterEach(() => {
    sinon.resetHistory();
  });

  describe('asyncData()', () => {
    const params = { pathMatch: '123/abc' };
    const record = { id: '/123/abc' };
    const $apis = { record: { getRecord: sinon.stub().resolves({ record }) } };
    const app = { i18n: { locale: 'en' } };

    describe('when the page is loaded without a metadataLanguage', () => {
      const route = { query: {} };

      it('gets a record from the API for the ID in the params pathMatch, for the current locale', async() => {
        const wrapper = factory();

        const response = await wrapper.vm.asyncData({ params, app, route, $apis });

        expect($apis.record.getRecord.calledWith('/123/abc', { locale: 'en', metadataLanguage: undefined })).toBe(true);
        expect(response).toEqual(record);
      });
    });
    describe('when the page is loaded with a metadataLanguage', () => {
      const route = { query: { lang: 'fr' } };

      it('gets a record from the API for the ID in the params pathMatch, with metadataLanguage from `lang` query', async() => {
        const wrapper = factory();

        const response = await wrapper.vm.asyncData({ params, app, route, $apis });

        expect($apis.record.getRecord.calledWith('/123/abc', { locale: 'en', metadataLanguage: 'fr' })).toBe(true);
        expect(response).toEqual(record);
      });
    });
  });

  describe('methods', () => {
    describe('fetchRelatedEntities()', () => {
      const organizations = [
        {
          about: 'http://data.europeana.eu/organization/12345'
        }
      ];
      const concepts = [
        {
          about: 'http://data.europeana.eu/concept/base/12345'
        }
      ];
      const pluginResponse = [
        {
          id: 'http://data.europeana.eu/concept/base/12345',
          prefLabel: { en: 'concept' },
          isShownBy: 'http://example.org/image.jpeg',
          altLabel: { en: 'alt concept' }
        },
        {
          id: 'http://data.europeana.eu/organization/12345',
          prefLabel: { en: 'organization' },
          logo: 'http://example.org/logo.jpeg',
          altLabel: { en: 'alt organization' }
        }
      ];
      const dataToStore = [
        {
          id: 'http://data.europeana.eu/concept/base/12345',
          prefLabel: { en: 'concept' },
          isShownBy: 'http://example.org/image.jpeg'
        },
        {
          id: 'http://data.europeana.eu/organization/12345',
          prefLabel: { en: 'organization' },
          logo: 'http://example.org/logo.jpeg'
        }
      ];

      it('fetches related entities from API plugin', async() => {
        const wrapper = factory();
        await wrapper.setData({
          concepts,
          organizations
        });
        wrapper.vm.$apis.entity.find = sinon.stub().resolves(pluginResponse);
        await wrapper.vm.fetchRelatedEntities();

        expect(wrapper.vm.$apis.entity.find.calledWith([
          'http://data.europeana.eu/concept/base/12345',
          'http://data.europeana.eu/organization/12345'
        ])).toBe(true);
      });

      it('picks fields from response and commits to store', async() => {
        const wrapper = factory();
        await wrapper.setData({
          concepts,
          organizations
        });
        wrapper.vm.$apis.entity.find = sinon.stub().resolves(pluginResponse);
        await wrapper.vm.fetchRelatedEntities();

        expect(itemSetRelatedEntities.calledWith(sinon.match.any, dataToStore)).toBe(true);
      });
    });
  });

  describe('head()', () => {
    it('uses first media large thumbnail for og:image', async() => {
      const thumbnailUrl = 'http://example.org/image/large.jpg';
      const wrapper = factory();
      await wrapper.setData({
        media: [
          {
            thumbnails: {
              large: thumbnailUrl
            }
          }
        ]
      });

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(thumbnailUrl);
    });
  });
});
