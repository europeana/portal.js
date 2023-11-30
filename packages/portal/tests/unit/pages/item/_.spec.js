import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/item/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const record = {
  identifier: '/123/abc',
  concepts: [
    { 'about': 'http://data.europeana.eu/concept/47', 'prefLabel': { 'en': ['Painting'] } },
    { 'about': 'http://data.europeana.eu/concept/01', 'prefLabel': { 'en': ['Fake'] } },
    { 'about': 'http://data.europeana.eu/concept/02', 'prefLabel': { 'en': ['Concept'] } },
    { 'about': 'http://data.europeana.eu/concept/03', 'prefLabel': { 'en': ['Entity'] } }
  ],
  organizations: [
    { 'about': 'http://data.europeana.eu/organization/01', 'prefLabel': { 'en': ['Data Provider'] } },
    { 'about': 'http://data.europeana.eu/organization/02', 'prefLabel': { 'en': ['Aggregator'] } }
  ],
  places: [
    { 'about': 'https://example.com/provider/entity', 'prefLabel': { 'en': ['Manchester'] } }
  ],
  metadata: {
    edmCountry: { def: ['Netherlands'] },
    edmDataProvider: {
      def: [
        { about: 'http://data.europeana.eu/organization/01', prefLabel: { en: ['Data Provider'] } }
      ]
    },
    edmProvider: {
      def: [
        { about: 'http://data.europeana.eu/organization/02', prefLabel: { en: ['Provider'] } }
      ]
    },
    edmRights: { def: ['http://rightsstatements.org/vocab/InC/1.0/'] }
  },
  title: { en: ['Item example'] }
};

const entityFindStub = sinon.stub();

const logEventSpy = sinon.spy();

const factory = ({ data = {}, mocks = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  stubs: ['client-only', 'i18n', 'ErrorMessage', 'EntityBadges', 'ItemLanguageSelector'],
  data() {
    return {
      ...data
    };
  },
  mixins: [
    {
      methods: {
        logEvent: logEventSpy
      }
    }
  ],
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
        find: entityFindStub
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
    $nuxt: {
      context: {
        $apis: {
          thumbnail: {
            media: () => 'https://api.europeana.eu/thumbnail/v3/400/476e256434ddaadd580d4f15500fbed0'
          }
        }
      }
    },
    $error: sinon.spy(),
    $session: { isActive: false },
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

    describe('when the requested item identifier is different from the identifier in the response', () => {
      it('redirects to the response identifier item page', async() => {
        const wrapper = factory({ data: { identifier: '/old/id' } });
        sinon.spy(wrapper.vm, 'redirectToAltRoute');

        await wrapper.vm.fetch();

        expect(wrapper.vm.redirectToAltRoute.calledWith({ params: { pathMatch: record.identifier.slice(1) } })).toBe(true);
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

    describe('client side fetching', () => {
      const $fetchState = { pending: false };

      it('fetches annotations', () => {
        const wrapper = factory({ mocks: { $fetchState } });

        expect(wrapper.vm.$apis.annotation.search.calledWith({
          query: 'target_record_id:"/123/abc"',
          qf: 'motivation:(linkForContributing OR tagging)',
          profile: 'dereference'
        })).toBe(true);
      });

      it('fetches entities', () => {
        const wrapper = factory({
          data: {
            agents: [{ about: 'http://data.europeana.eu/agent/1' }],
            concepts: [{ about: 'http://data.europeana.eu/concept/1' }],
            places: [{ about: 'http://data.europeana.eu/place/1' }],
            timespans: [{ about: 'http://data.europeana.eu/timespan/1' }]
          },
          mocks: { $fetchState }
        });

        expect(wrapper.vm.$apis.entity.find.calledWith(
          [
            'http://data.europeana.eu/agent/1',
            'http://data.europeana.eu/concept/1',
            'http://data.europeana.eu/timespan/1',
            'http://data.europeana.eu/place/1'
          ],
          { fl: 'skos_prefLabel.*,isShownBy,isShownBy.thumbnail,foaf_logo' }
        )).toBe(true);
      });

      it('does not fetch entities if there are none', () => {
        const wrapper = factory({ mocks: { $fetchState } });

        expect(wrapper.vm.$apis.entity.find.called).toBe(false);
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

      it('bails if NO Matomo plugin is installed', async() => {
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

    describe('fetchEntities', () => {
      afterEach(() => entityFindStub.reset());
      describe('when there is an entity URI in the dataProvider attribute', () => {
        describe('when entities can be retrieved', () => {
          const successEntityResponse = [
            { id: 'http://data.europeana.eu/concept/47' },
            { id: 'http://data.europeana.eu/concept/01' },
            { id: 'http://data.europeana.eu/concept/02' },
            { id: 'http://data.europeana.eu/concept/03' },
            { id: 'http://data.europeana.eu/organization/01', logo: 'https://example.com/provider/logo.jpg' },
            { id: 'http://data.europeana.eu/organization/02' }
          ];
          entityFindStub.resolves(successEntityResponse);
          it('fetches the first 5 entity URIs as relatedCollections and the dataProvider entity', async() => {
            const wrapper = factory({
              data: {
                metadata: record.metadata,
                organizations: record.organizations,
                concepts: record.concepts
              }
            });

            await wrapper.vm.fetchEntities();

            const relatedCollections = wrapper.vm.relatedCollections;
            const dataProviderEntity = wrapper.vm.dataProviderEntity;

            expect(relatedCollections.length).toBe(5);
            expect(dataProviderEntity.id).toBe('http://data.europeana.eu/organization/01');
            expect(dataProviderEntity.logo).toBe('https://example.com/provider/logo.jpg');
          });
        });
        describe('when entities can NOT be retrieved', () => {
          describe('when there is a prefLabel to use', () => {
            it('uses the record data to fill in the dataProviderEntity', async() => {
              entityFindStub.rejects();
              const wrapper = factory({
                data: {
                  metadata: record.metadata,
                  organizations: record.organizations,
                  concepts: record.concepts
                }
              });

              await wrapper.vm.fetchEntities();

              const relatedCollections = wrapper.vm.relatedCollections;
              const dataProviderEntity = wrapper.vm.dataProviderEntity;

              expect(relatedCollections.length).toBe(0);
              expect(dataProviderEntity.id).toBe('http://data.europeana.eu/organization/01');
              expect(dataProviderEntity.logo).toBe(undefined);
            });
          });
        });
      });
      describe('when the data provider is a langMap not an entity', () => {
        it('fetches the first 5 entity URIs as relatedCollections', async() => {
          const expectedParams = [
            [
              'http://data.europeana.eu/concept/47',
              'http://data.europeana.eu/concept/01',
              'http://data.europeana.eu/concept/02',
              'http://data.europeana.eu/concept/03',
              'http://data.europeana.eu/organization/01'
            ],
            { fl: 'skos_prefLabel.*,isShownBy,isShownBy.thumbnail,foaf_logo' }
          ];
          const successEntityResponse = [
            { id: 'http://data.europeana.eu/concept/47' },
            { id: 'http://data.europeana.eu/concept/01' },
            { id: 'http://data.europeana.eu/concept/02' },
            { id: 'http://data.europeana.eu/concept/03' },
            { id: 'http://data.europeana.eu/organization/01', logo: 'https://example.com/provider/logo.jpg' }
          ];
          entityFindStub.resolves(successEntityResponse);
          const wrapper = factory({
            data: {
              metadata: {
                edmDataProvider: {
                  nl: ['Voorbeeld organisatie']
                }
              },
              organizations: record.organizations,
              concepts: record.concepts
            }
          });

          await wrapper.vm.fetchEntities();

          const relatedCollections = wrapper.vm.relatedCollections;
          const dataProviderEntity = wrapper.vm.dataProviderEntity;

          expect(entityFindStub.calledWith(...expectedParams)).toBe(true);
          expect(relatedCollections.length).toBe(5);
          expect(dataProviderEntity).toBe(null);
        });
      });
    });
  });

  describe('computed', () => {
    describe('pageMeta', () => {
      it('uses first media large thumbnail for og:image', async() => {
        const mediaUrl = 'http://example.org/image.jpeg';
        const wrapper = factory({
          data: {
            media: [
              { about: mediaUrl }
            ]
          }
        });

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.ogImage).toBe('https://api.europeana.eu/thumbnail/v3/400/476e256434ddaadd580d4f15500fbed0');
      });

      it('uses the title in current language', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.title).toBe('Item example');
      });
    });
    describe('dataProviderEntityUri', () => {
      it('gets the URI from the edmDataProvider attribute, if it conforms to the europeana entity URI spec', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();
        const uri = wrapper.vm.dataProviderEntityUri;
        expect(uri).toBe('http://data.europeana.eu/organization/01');
      });
    });
    describe('relatedEntityUris', () => {
      it('limits the total to 5 and does not include the dataProvider entity', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();
        const entityUris = wrapper.vm.relatedEntityUris;
        expect(entityUris.length).toBe(5);
        expect(entityUris.includes('http://data.europeana.eu/organization/01')).toBe(false);
      });
    });
    describe('matomoOptions', () => {
      it('picks the english pref labels from the metadata', () => {
        const wrapper = factory({
          data: {
            metadata: record.metadata
          }
        });
        const matomoOptions = wrapper.vm.matomoOptions;

        expect(matomoOptions.dimension1).toBe('Netherlands');
        expect(matomoOptions.dimension2).toBe('Data Provider');
        expect(matomoOptions.dimension3).toBe('Provider');
        expect(matomoOptions.dimension4).toBe('http://rightsstatements.org/vocab/InC/1.0/');
      });
    });
  });
});
