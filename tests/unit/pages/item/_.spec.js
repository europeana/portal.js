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
  metadata: {
    edmCountry: ['Netherlands'],
    edmDataProvider: {
      url: 'https://www.example.eu',
      value: ['Data Provider']
    },
    edmProvider: [{ en: ['Provider'] }],
    edmRights: { def: [
      'http://rightsstatements.org/vocab/InC/1.0/'
    ] }
  }
};

const itemSetRelatedEntities = sinon.spy();
const store = new Vuex.Store({
  state: {
    entity: {
      curatedEntities: [
        {
          name: 'World War I',
          nameEN: 'World War I',
          identifier: 'http://data.europeana.eu/concept/base/83',
          genre: 'ww1'
        },
        {
          name: 'Manuscripts',
          nameEN: 'Manuscripts',
          identifier: 'http://data.europeana.eu/concept/base/17',
          genre: 'manuscript'
        }
      ]
    },
    auth: {
      user: null
    }
  },
  getters: {
    'entity/isPinned': () => () => false,
    'http/canonicalUrl': () => () => null,
    'set/isLiked': () => () => null
  }
});

const record = { id: '/123/abc' };

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return item;
  },
  stubs: ['client-only'],
  mocks: {
    $features: {},
    $pageHeadTitle: key => key,
    $route: {
      params: { pathMatch: '123/abc' },
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
        getRecord: sinon.stub().resolves(record),
        search: sinon.spy()
      }
    },
    $fetchState: {},
    $matomo: {
      trackPageView: sinon.spy()
    },
    ...mocks
  },
  store
});

describe('pages/item/_.vue', () => {
  afterEach(sinon.resetHistory);

  describe('fetch()', () => {
    describe('when the page is loaded without a metadataLanguage', () => {
      it('gets a record from the API for the ID in the route params pathMatch, for the current locale', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.getRecord.calledWith('/123/abc', { locale: 'en', metadataLanguage: undefined })).toBe(true);
      });
    });
    describe('when the page is loaded with a metadataLanguage', () => {
      it('gets a record from the API for the ID in the params pathMatch, with metadataLanguage from `lang` query', async() => {
        const wrapper = factory();
        wrapper.vm.$route.query = { lang: 'fr' };

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.getRecord.calledWith('/123/abc', { locale: 'en', metadataLanguage: 'fr' })).toBe(true);
      });
    });
  });

  describe('mounted', () => {
    describe('when matomo is active', () => {
      it('sends custom dimensions in English', () => {
        const wrapper = factory();

        expect(wrapper.vm.$matomo.trackPageView.calledWith('item page custom dimensions',
          wrapper.vm.matomoOptions())).toBe(true);
      });
    });
  });

  describe('methods', () => {
    // TODO: update
    // describe('annotationsByMotivation()', () => {
    //   describe('when there are annotations', () => {
    //     const state = {
    //       annotations
    //     };
    //     describe('when asking for tagging annotations', () => {
    //       it('has a tagging motivation', () => {
    //         const taggingAnnotations = store.getters.annotationsByMotivation(state)('tagging');
    //         expect(taggingAnnotations[0].motivation).toBe('tagging');
    //         expect(taggingAnnotations.length).toBe(1);
    //       });
    //     });
    //     describe('when asking for transcribing annotations', () => {
    //       it('has a transcribing motivation', () => {
    //         const taggingAnnotations = store.getters.annotationsByMotivation(state)('transcribing');
    //         expect(taggingAnnotations[0].motivation).toBe('transcribing');
    //         expect(taggingAnnotations.length).toBe(1);
    //       });
    //     });
    //   });
    // });
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
