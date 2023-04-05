import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/item/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const record = {
  identifier: '/123/abc',
  concepts: [{ 'about': 'http://data.europeana.eu/concept/47', 'prefLabel': { 'en': ['Painting'] } }],
  metadata: {
    edmCountry: ['Netherlands'],
    edmDataProvider: {
      url: 'https://www.example.eu',
      value: ['Data Provider']
    },
    edmProvider: [{ en: ['Provider'] }],
    edmRights: { def: ['http://rightsstatements.org/vocab/InC/1.0/'] }
  },
  title: { en: ['Item example'] }
};

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  stubs: ['client-only', 'i18n', 'ErrorMessage'],
  mocks: {
    $features: { translatedItems: true },
    $config: {
      app: {
        baseUrl: 'https://www.example.org'
      }
    },
    $route: {
      params: { pathMatch: '123/abc' },
      query: {},
      fullPath: '/en/item/123/abc',
      path: '/en/item/123/abc'
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
    $fetchState: {},
    $waitForMatomo: () => Promise.resolve(),
    $matomo: {
      trackPageView: sinon.spy()
    },
    $error: sinon.spy(),
    ...mocks
  }
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

    describe('on errors', () => {
      it('calls $error', async() => {
        const wrapper = factory();
        wrapper.vm.$apis.record.getRecord = sinon.stub().throws(() => new Error('Internal Server Error'));

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.called).toBe(true);
      });
    });

    describe('on client-side request', () => {
      it('sends custom dimensions to Matomo', async() => {
        process.client = true;
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$matomo.trackPageView.calledWith(
          'item page custom dimensions',
          wrapper.vm.matomoOptions
        )).toBe(true);
      });
    });

    describe('on server-side request', () => {
      it('does not send custom dimensions to Matomo', async() => {
        process.client = false;
        const wrapper = await factory();
        sinon.resetHistory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$matomo.trackPageView.called).toBe(false);
      });
    });
  });

  describe('mounted', () => {
    describe('when fetch is still pending', () => {
      const $fetchState = { pending: true };

      it('does not send custom dimensions to Matomo', async() => {
        const wrapper = await factory({ mocks: { $fetchState } });

        expect(wrapper.vm.$matomo.trackPageView.called).toBe(false);
      });
    });

    describe('when fetch errored', () => {
      const $fetchState = { pending: false, error: { message: 'Item not found' } };

      it('does not send custom dimensions to Matomo', async() => {
        const wrapper = await factory({ mocks: { $fetchState } });

        expect(wrapper.vm.$matomo.trackPageView.called).toBe(false);
      });
    });

    describe('when fetch completed without error', () => {
      const $fetchState = { pending: false };

      it('sends custom dimensions to Matomo', async() => {
        const wrapper = await factory({ mocks: { $fetchState } });

        expect(wrapper.vm.$matomo.trackPageView.calledWith(
          'item page custom dimensions',
          wrapper.vm.matomoOptions
        )).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('trackCustomDimensions', () => {
      it('tracks page view if Matomo plugin installed', async() => {
        const wrapper = factory();

        await wrapper.vm.trackCustomDimensions();

        expect(wrapper.vm.$matomo.trackPageView.called).toBe(true);
      });

      it('bails if no Matomo plugin not installed', async() => {
        const wrapper = factory({ mocks: { $waitForMatomo: undefined } });

        await wrapper.vm.trackCustomDimensions();

        expect(wrapper.vm.$matomo.trackPageView.called).toBe(false);
      });
    });

    describe('annotationsByMotivation', () => {
      const annotations = [
        {
          motivation: 'linkForContributing',
          body: 'https://transcribation.europeana.eu'
        },
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

      describe('when asking for linkForContributing', () => {
        it('has a linkForContributing motivation', async() => {
          const wrapper = await factory();
          await wrapper.setData({ annotations });

          const linkForContributing = wrapper.vm.annotationsByMotivation('linkForContributing');

          expect(linkForContributing[0].motivation).toBe('linkForContributing');
          expect(linkForContributing.length).toBe(1);
        });
      });

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

  describe('computed', () => {
    describe('pageMeta', () => {
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

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.ogImage).toBe(thumbnailUrl);
      });

      it('uses the title in current language', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.title).toBe('Item example');
      });
    });
  });
});
