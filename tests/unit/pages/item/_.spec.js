import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/item/_';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const record = {
  identifier: '/123/abc',
  concepts: [{ 'about': 'http://data.europeana.eu/concept/base/47', 'prefLabel': { 'en': ['Painting'] } }],
  metadata: {
    edmCountry: ['Netherlands'],
    edmDataProvider: {
      url: 'https://www.example.eu',
      value: ['Data Provider']
    },
    edmProvider: [{ en: ['Provider'] }],
    edmRights: { def: ['http://rightsstatements.org/vocab/InC/1.0/'] }
  }
};

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => () => null
  }
});

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  stubs: ['client-only', 'i18n'],
  mocks: {
    $features: { translatedItems: true },
    $pageHeadTitle: key => key,
    $route: {
      params: { pathMatch: '123/abc' },
      query: {}
    },
    $t: key => key,
    $i18n: {
      locale: 'en',
      locales: ['en']
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
        getRecord: sinon.stub().resolves({ record }),
        search: sinon.spy()
      }
    },
    $fetchState: mocks.fetchState || {},
    $matomo: {
      trackPageView: sinon.spy()
    },
    $nuxt: {
      context: {
        res: {}
      }
    },
    ...mocks
  },
  store
});

describe('pages/item/_.vue', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
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

    it('stores the response', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.identifier).toBe(record.identifier);
      expect(wrapper.vm.metadata).toEqual(record.metadata);
    });

    it('handles API errors', async() => {
      const wrapper = factory();
      process.server = true;
      wrapper.vm.$apis.record.getRecord = sinon.stub().throws(() => new Error('Internal Server Error'));

      let error;
      try {
        await wrapper.vm.fetch();
      } catch (e) {
        error = e;
      }

      expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
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
    describe('annotationsByMotivation', () => {
      const annotations = [
        {
          motivation: 'transcribing',
          body: {
            type: 'FullTextResource',
            value: 'This is the full transcription!',
            language: 'en'
          }
        },
        {
          motivation: 'tagging',
          body: {
            type: 'Concept',
            prefLabel: {
              en: 'tag',
              fr: 'tag FR'
            }
          }
        }
      ];

      describe('when asking for tagging annotations', () => {
        it('has a tagging motivation', async() => {
          const wrapper = await factory();
          await wrapper.setData({ annotations });

          const taggingAnnotations = wrapper.vm.annotationsByMotivation('tagging');

          expect(taggingAnnotations[0].motivation).toBe('tagging');
          expect(taggingAnnotations.length).toBe(1);
        });
      });

      describe('when asking for transcribing annotations', () => {
        it('has a transcribing motivation', async() => {
          const wrapper = await factory();
          await wrapper.setData({ annotations });

          const taggingAnnotations = wrapper.vm.annotationsByMotivation('transcribing');

          expect(taggingAnnotations[0].motivation).toBe('transcribing');
          expect(taggingAnnotations.length).toBe(1);
        });
      });
    });

    describe('keywords', () => {
      const annotations = [
        {
          motivation: 'tagging',
          body: {
            type: 'Concept',
            prefLabel: {
              en: 'tag 1 EN',
              fr: 'tag 1 FR'
            }
          }
        },
        {
          motivation: 'tagging',
          body: {
            type: 'Concept',
            prefLabel: {
              en: 'tag 2 EN',
              es: 'tag 2 ES'
            }
          }
        }
      ];

      it('converts tagging annotation prefLabels into a single LangMap', async() => {
        const wrapper = await factory();
        await wrapper.setData({ annotations });

        const keywords = wrapper.vm.keywords;

        expect(keywords).toEqual({
          en: ['tag 1 EN', 'tag 2 EN'],
          fr: ['tag 1 FR'],
          es: ['tag 2 ES']
        });
      });
    });
  });

  describe('head', () => {
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

  describe('when fetch errors', () => {
    it('renders an alert message', () => {
      const wrapper = factory({ mocks: { fetchState: { error: { message: 'Error message' } } } });

      const alertMessage = wrapper.find('[data-qa="alert message container"]');

      expect(alertMessage.exists()).toBe(true);
    });
  });
});
