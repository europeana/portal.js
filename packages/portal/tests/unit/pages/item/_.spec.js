import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import createHttpError from 'http-errors';

import page from '@/pages/item/_';
import useDeBias from '@/composables/deBias.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const apiResponse = () => ({
  object: {
    about: '/123/abc',
    aggregations: [
      {
        about: '/aggregation/provider/123/abc',
        edmDataProvider: {
          def: [
            { about: 'http://data.europeana.eu/organization/01', prefLabel: { en: ['Data Provider'] } }
          ]
        },
        edmIsShownBy: 'http://example.org/image.jpeg',
        edmProvider: {
          def: [
            { about: 'http://data.europeana.eu/organization/02', prefLabel: { en: ['Provider'] } }
          ]
        },
        edmRights: { def: ['http://rightsstatements.org/vocab/InC/1.0/'] },
        webResources: [
          {
            about: 'http://example.org/image.jpeg',
            ebucoreHasMimeType: 'image/jpeg'
          }
        ]
      }
    ],
    europeanaAggregation: {
      about: '/aggregation/europeana/123/abc',
      edmCountry: { def: ['Netherlands'] }
    },
    europeanaCollectionName: [
      '123_Collection'
    ],
    concepts: [
      { about: 'http://data.europeana.eu/concept/47', prefLabel: { en: ['Painting'] }, note: { en: ['About the painting'] } },
      { about: 'http://data.europeana.eu/concept/01', prefLabel: { en: ['Fake'] }, note: { en: ['About the fake'] } },
      { about: 'http://data.europeana.eu/concept/02', prefLabel: { en: ['Concept'] }, note: { en: ['About the concept'] } },
      { about: 'http://data.europeana.eu/concept/03', prefLabel: { en: ['Entity'] }, note: { en: ['About the entity'] } }
    ],
    organizations: [
      { about: 'http://data.europeana.eu/organization/01', prefLabel: { en: ['Data Provider'] } },
      { about: 'http://data.europeana.eu/organization/02', prefLabel: { en: ['Aggregator'] } }
    ],
    places: [
      { about: 'https://example.com/provider/entity', prefLabel: { en: ['Manchester'] } }
    ],
    proxies: [
      {
        about: '/proxy/europeana/123/abc',
        dcFormat: {
          def: ['http://data.europeana.eu/concept/47']
        },
        dcTitle: {
          de: ['Deutscher Titel']
        }
      },
      {
        about: '/proxy/aggregator/123/abc',
        dcDescription: {
          de: ['Deutsche Beschreibung']
        },
        edmIsRelatedTo: {
          def: ['http://data.europeana.eu/concept/01']
        }
      },
      {
        about: '/proxy/provider/123/abc',
        dcTitle: {
          en: ['Provider title']
        },
        dcType: {
          de: ['Deutscher Objekt Typ']
        }
      }
    ]
  }
});

// TODO: get rid of this as it's derived from apiResponse?
const record = {
  entities: [
    { about: 'http://data.europeana.eu/concept/47', prefLabel: { en: ['Painting'] } },
    { about: 'http://data.europeana.eu/concept/01', prefLabel: { en: ['Fake'] } },
    { about: 'http://data.europeana.eu/concept/02', prefLabel: { en: ['Concept'] } },
    { about: 'http://data.europeana.eu/concept/03', prefLabel: { en: ['Entity'] } },
    { about: 'http://data.europeana.eu/organization/01', prefLabel: { en: ['Data Provider'] } },
    { about: 'http://data.europeana.eu/organization/02', prefLabel: { en: ['Aggregator'] } },
    { about: 'https://example.com/provider/entity', prefLabel: { en: ['Manchester'] } }
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

const fixtures = {
  annotationSearchResponse: [
    {
      id: 'http://example.org/annotation/highlighting/2',
      motivation: 'highlighting',
      body: {
        id: 'http://example.org/vocabulary/debias/1',
        definition: {
          en: 'May cause offense'
        }
      },
      target: {
        selector: { hasPredicate: 'dc:title', refinedBy: { exact: { '@language': 'en', '@value': 'offensive' } } }
      }
    }
  ],
  auth: {
    loggedIn: { $auth: { loggedIn: true } },
    notLoggedIn: { $auth: { loggedIn: false } }
  },
  route: {
    standard: {
      $route: {
        params: { pathMatch: '123/abc' },
        fullPath: '/en/item/123/abc',
        path: '/en/item/123/abc',
        query: {}
      }
    },
    translating: {
      $route: {
        params: { pathMatch: '123/abc' },
        fullPath: '/en/item/123/abc',
        path: '/en/item/123/abc',
        query: { lang: 'de' }
      }
    }
  }
};

const entityFindStub = sinon.stub();
const logEventSpy = sinon.spy();
const redirectSpy = sinon.spy();

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
        logEvent: logEventSpy,
        redirectToAltRoute: redirectSpy
      }
    }
  ],
  mocks: {
    ...fixtures.auth.notLoggedIn,
    ...fixtures.route.standard,
    $config: {
      app: {
        baseUrl: 'https://www.example.org'
      },
      matomo: {}
    },
    $features: { translatedItems: true },
    $t: (key) => key,
    $i18n: {
      locale: 'en'
    },
    $apis: {
      annotation: {
        search: sinon.stub().resolves(fixtures.annotationSearchResponse)
      },
      entity: {
        find: entityFindStub
      },
      record: {
        get: sinon.stub().resolves(apiResponse()),
        search: sinon.spy()
      },
      thumbnail: {
        forWebResource: () => ({
          large: 'https://api.europeana.eu/thumbnail/v3/400/476e256434ddaadd580d4f15500fbed0',
          small: 'https://api.europeana.eu/thumbnail/v3/200/476e256434ddaadd580d4f15500fbed0'
        })
      }
    },
    $fetchState: {},
    $waitForMatomo: () => Promise.resolve(),
    $matomo: {
      trackPageView: sinon.spy()
    },
    $error: sinon.spy(),
    $session: { isActive: false },
    ...mocks
  }
});

describe('pages/item/_.vue', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when the page is loaded without a lang route query param', () => {
      it('gets a record from the API for the ID in the route params pathMatch', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.get.calledWith('/123/abc')).toBe(true);
      });
    });

    describe('when the page is loaded with a lang route query param', () => {
      describe('and the user is not logged in', () => {
        const mocks = {
          ...fixtures.auth.notLoggedIn,
          ...fixtures.route.translating
        };

        it('redirects to the non-translated item page', async() => {
          const wrapper = factory({ mocks });

          await wrapper.vm.fetch();

          expect(redirectSpy.calledWith({ query: { lang: undefined } })).toBe(true);
        });

        it('does not fetch metadata with translate profile', async() => {
          const wrapper = factory({ mocks });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$apis.record.get.calledWith('/123/abc', { locale: 'en', metadataLanguage: 'fr' })).toBe(false);
        });
      });

      describe('and the user is logged in', () => {
        const mocks = {
          ...fixtures.auth.loggedIn,
          ...fixtures.route.translating
        };

        it('gets a record from the API for the ID in the params pathMatch, with translate and lang profiles', async() => {
          const wrapper = factory({ mocks });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$apis.record.get.calledWith('/123/abc', { lang: 'de', profile: 'translate' })).toBe(true);
        });

        describe('but the API responds with a translation quota error', () => {
          const error = new Error('Translation quota error');
          error.response = {
            data: {
              code: '502-TS'
            },
            status: 502
          };

          it('refetches the record without translation', async() => {
            const wrapper = factory({ mocks });

            wrapper.vm.$apis.record.get.withArgs('/123/abc', { lang: 'de', profile: 'translate' }).rejects(error);
            wrapper.vm.$apis.record.get.withArgs('/123/abc').resolves(apiResponse());

            await wrapper.vm.fetch();

            expect(wrapper.vm.$apis.record.get.getCalls().length).toBe(2);
            expect(wrapper.vm.$apis.record.get.calledWith('/123/abc', { lang: 'de', profile: 'translate' })).toBe(true);
            expect(wrapper.vm.$apis.record.get.calledWith('/123/abc')).toBe(true);
          });
        });
      });
    });

    it('fetches annotations', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.annotation.search.calledWith({
        query: 'target_record_id:"/123/abc"',
        qf: 'motivation:(highlighting OR linkForContributing OR tagging)',
        profile: 'dereference'
      })).toBe(true);
    });

    it('parses DeBias annotations via composable', async() => {
      const { terms } = useDeBias();
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(terms.value.dcTitle).toEqual([{ exact: 'offensive' }]);
    });

    describe('when the requested item identifier is different from the identifier in the response', () => {
      it('redirects to the response identifier item page', async() => {
        const wrapper = factory({ data: { identifier: '/old/id' } });

        await wrapper.vm.fetch();

        expect(redirectSpy.calledWith({ params: { pathMatch: apiResponse().object.about.slice(1) } })).toBe(true);
      });
    });

    describe('API response storage', () => {
      describe('`identifier`', () => {
        it('stores the item URI', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.identifier).toBe(apiResponse().object.about);
        });
      });

      describe('`entities`', () => {
        it('stores all entities in a single array', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.entities.length).toBe(7);
        });

        it('reduces entities to about and prefLabel', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.entities.every((entity) => entity.about)).toBe(true);
          expect(wrapper.vm.entities.every((entity) => entity.prefLabel)).toBe(true);
          expect(wrapper.vm.entities.some((entity) => entity.note)).toBe(false);
        });
      });

      describe('`ogImage`', () => {
        it('uses first media large thumbnail for og:image', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.ogImage).toBe('https://api.europeana.eu/thumbnail/v3/400/476e256434ddaadd580d4f15500fbed0');
        });
      });

      describe('`metadata`', () => {
        it('stores europeanaCollectionName with link to search', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.metadata.europeanaCollectionName.value).toEqual(['123_Collection']);
          expect(wrapper.vm.metadata.europeanaCollectionName.url).toEqual({
            name: 'search',
            query: { query: 'europeana_collectionName:"123_Collection"' }
          });
        });

        describe('Europeana proxy', () => {
          describe('when not translating', () => {
            const mocks = {
              ...fixtures.auth.notLoggedIn,
              ...fixtures.route.standard
            };

            it('omits language-specific metadata from the Europeana proxy', async() => {
              const wrapper = factory({ mocks });

              await wrapper.vm.fetch();
              await wrapper.vm.$nextTick();

              expect(wrapper.vm.metadata.dcTitle).toEqual({ en: ['Provider title'] });
            });

            it('includes non-language-specific metadata from the Europeana proxy', async() => {
              const wrapper = factory({ mocks });

              await wrapper.vm.fetch();
              await wrapper.vm.$nextTick();

              expect(wrapper.vm.metadata.dcFormat.def).toEqual([{
                about: 'http://data.europeana.eu/concept/47',
                prefLabel: { en: ['Painting'] }
              }]);
            });
          });

          describe('when translating', () => {
            const mocks = {
              ...fixtures.auth.loggedIn,
              ...fixtures.route.translating
            };

            it('includes language-specific metadata from the Europeana proxy', async() => {
              const wrapper = factory({ mocks });

              await wrapper.vm.fetch();

              expect(wrapper.vm.metadata.dcTitle).toEqual({
                de: ['Deutscher Titel'],
                translationSource: 'automated'
              });
            });

            it('includes non-language-specific metadata from the Europeana proxy', async() => {
              const wrapper = factory({ mocks });

              await wrapper.vm.fetch();

              expect(wrapper.vm.metadata.dcFormat.def).toEqual([{
                about: 'http://data.europeana.eu/concept/47',
                prefLabel: { en: ['Painting'] }
              }]);
            });
          });
        });

        describe('translation source labels', () => {
          const mocks = {
            ...fixtures.auth.loggedIn,
            ...fixtures.route.translating
          };

          describe('when there is a value in the Europeana proxy', () => {
            it('is considered an automated translation', async() => {
              const wrapper = factory({ mocks });

              await wrapper.vm.fetch();

              expect(wrapper.vm.metadata.dcTitle.translationSource).toBe('automated');
            });
          });

          describe('when there is a value in the aggregator proxy', () => {
            describe('when the value is in a lang map', () => {
              it('is considered an enrichment', async() => {
                const wrapper = factory({ mocks });

                await wrapper.vm.fetch();

                expect(wrapper.vm.metadata.dcDescription.translationSource).toBe('enrichment');
              });
            });
            describe('when the value refers to an entity', () => {
              it('is considered an enrichment', async() => {
                const wrapper = factory({ mocks });

                await wrapper.vm.fetch();

                expect(wrapper.vm.metadata.edmIsRelatedTo.translationSource).toBe('enrichment');
              });
            });
          });
          describe('when there is only a value in the default proxy', () => {
            it('does not flag the field with a translation source', async() => {
              const wrapper = factory({ mocks });

              await wrapper.vm.fetch();

              expect(wrapper.vm.metadata.dcType.translationSource).toBeUndefined();
            });
          });
        });
      });

      describe('preconnect links', () => {
        it('includes first displayable web resource origin', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.headLinkPreconnect.includes('http://example.org')).toBe(true);
        });

        it('includes IIIF Presentation manifest origin', async() => {
          const wrapper = factory();
          const response = apiResponse();
          const manifest = 'https://iiif.example.org/presentation/123/abc/manifest';
          response.object.aggregations[0].webResources[0].dctermsIsReferencedBy = manifest;
          response.object.aggregations[0].webResources.push({
            about: manifest,
            rdfType: 'http://iiif.io/api/presentation/3#Manifest'
          });
          wrapper.vm.$apis.record.get.resolves(response);

          await wrapper.vm.fetch();

          expect(wrapper.vm.headLinkPreconnect.includes('https://iiif.example.org')).toBe(true);
        });
      });
    });

    describe('on errors', () => {
      it('calls $error', async() => {
        const wrapper = factory();
        wrapper.vm.$apis.record.get = sinon.stub().throws(() => new Error('Internal Server Error'));

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.called).toBe(true);
      });

      describe('when error is 410 Gone (tombstone)', () => {
        it('(temporarily) calls $error as with 404 Not Found', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.get = sinon.stub().throws(() => createHttpError(410));

          await wrapper.vm.fetch();

          expect(wrapper.vm.$error.calledWith(sinon.match.has('statusCode', 404))).toBe(true);
        });
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

  describe('head', () => {
    it('includes preconnect links', () => {
      const origin = 'https://example.org';
      const wrapper = factory({ data: { headLinkPreconnect: [origin] } });

      expect(wrapper.vm.head().link).toContainEqual({ rel: 'preconnect', href: origin });
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

      it('fetches entities', () => {
        const wrapper = factory({
          data: {
            entities: [
              { about: 'http://data.europeana.eu/agent/1' },
              { about: 'http://data.europeana.eu/concept/1' },
              { about: 'http://data.europeana.eu/place/1' },
              { about: 'http://data.europeana.eu/timespan/1' }
            ]
          },
          mocks: { $fetchState }
        });

        expect(wrapper.vm.$apis.entity.find.calledWith(
          [
            'http://data.europeana.eu/agent/1',
            'http://data.europeana.eu/concept/1',
            'http://data.europeana.eu/place/1',
            'http://data.europeana.eu/timespan/1'
          ]
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
                entities: record.entities
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
                  entities: record.entities
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
            ]
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
              entities: apiResponse().object.concepts.concat(apiResponse().object.organizations)
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
      it('uses the title in current language', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();
        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.title).toBe('Provider title');
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
