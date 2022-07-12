import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import collection from '@/pages/collections/_type/_';

const localVue = createLocalVue();
localVue.directive('masonry-tile', {});
localVue.use(BootstrapVue);

const organisationEntity = {
  entity: {
    id: 'http://data.europeana.eu/organization/01234567890',
    logo: { id: 'http://commons.wikimedia.org/wiki/Special:FilePath/Albertina%20Logo.svg' },
    description: { en: 'example of an organisation description' },
    note: { en: 'editable description' },
    prefLabel: { en: 'English name', nl: 'Dutch name' },
    homepage: 'https://www.example-organisation.eu',
    hasAddress: {
      countryName: 'The Netherlands',
      locality: 'The Hague'
    },
    acronym: { en: 'ABC' },
    type: 'Organization'
  },
  type: 'organisation',
  pathMatch: '01234567890-organisation'
};

const topicEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/01234567890',
    description: { en: 'example of a topic description' },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' },
    prefLabel: { en: 'Topic' },
    type: 'Concept'
  },
  type: 'topic',
  pathMatch: '01234567890-topic'
};

const themeEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/62',
    description: { en: 'example of a theme description' },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' },
    prefLabel: { en: 'Theme' },
    type: 'Concept'
  },
  type: 'topic',
  pathMatch: '62-theme'
};

const contentfulPageResponse = {
  data: {
    data: {
      entityPage: {
        items: []
      },
      curatedEntities: {
        items: []
      }
    }
  }
};
const contentfulQueryStub = sinon.stub().resolves(contentfulPageResponse);

const factory = (options = {}) => shallowMountNuxt(collection, {
  localVue,
  mocks: {
    $fetchState: {},
    $t: (key, args) => args ? `${key} ${args}` : key,
    $tc: (key) => key,
    $te: () => true,
    $route: { query: options.query || '', params: { type: options.type, pathMatch: options.pathMatch } },
    $contentful: {
      query: contentfulQueryStub
    },
    $apis: {
      entity: {
        get: sinon.stub().resolves({}),
        facets: sinon.stub().resolves([]),
        imageUrl: sinon.spy()
      },
      entityManagement: {
        get: sinon.stub().resolves({})
      }
    },
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $features: { sideFilters: false },
    $pageHeadTitle: key => key,
    $path: () => '/',
    $nuxt: { context: { redirect: sinon.spy(), app: { router: { replace: sinon.spy() } } } },
    $store: {
      state: {
        entity: {
          entity: options.entity,
          ...options.entityStoreState
        },
        i18n: {
          locale: 'en'
        },
        auth: {},
        search: {
          showSearchBar: true
        }
      },
      getters: {
        'entity/curatedEntity': sinon.stub().returns(null),
        'search/facetNames': sinon.stub().returns([]),
        'search/filters': sinon.stub().returns({}),
        'search/queryUpdatesForFacetChanges': sinon.stub().returns({}),
        'search/collection': sinon.stub().returns(false)
      },
      dispatch: sinon.spy(),
      commit: sinon.spy()
    },
    ...options.mocks
  }
});

describe('pages/collections/type/_', () => {
  beforeEach(sinon.resetHistory);

  describe('fetch', () => {
    it('disables collection facet via search store', async() => {
      const wrapper = factory(topicEntity);

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.commit.calledWith('search/disableCollectionFacet')).toBe(true);
    });

    it('requests entity from Entity API', async() => {
      const wrapper = factory(topicEntity);

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.entity.get.calledWith(topicEntity.type, topicEntity.pathMatch)).toBe(true);
    });

    it('stores the collection label in search store', async() => {
      const wrapper = factory(topicEntity);

      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.commit.calledWith('search/setCollectionLabel', 'Topic')).toBe(true);
    });

    describe('collection page', () => {
      const requestMade = async(curatedEntities) => {
        const wrapper = factory(topicEntity);
        wrapper.vm.$store.state.entity.curatedEntities = curatedEntities;

        await wrapper.vm.fetch();

        return wrapper.vm.$contentful.query.calledWith('collectionPage', {
          identifier: topicEntity.entity.id,
          locale: 'en-GB',
          preview: false
        });
      };

      describe('when it is not known whether the entity has one', () => {
        const curatedEntities = null;
        it('is requested from Contentful', async() => {
          expect(await requestMade(curatedEntities)).toBe(true);
        });
      });

      describe('when it is known that the entity has one', () => {
        const curatedEntities = [{ identifier: topicEntity.entity.id }];
        it('is requested from Contentful', async() => {
          expect(await requestMade(curatedEntities)).toBe(true);
        });
      });

      describe('when it is known that the entity does not have one', () => {
        const curatedEntities = [{}];
        it('is not requested from Contentful', async() => {
          expect(await requestMade(curatedEntities)).toBe(false);
        });
      });
    });

    describe('entity management', () => {
      const auth = {
        authorized: { user: { 'resource_access': { entities: { roles: ['editor'] } } } },
        unauthorized: { user: { 'resource_access': { entities: { roles: [] } } } }
      };
      const requestMade = async($auth) => {
        const wrapper = factory(topicEntity);
        wrapper.vm.$auth = $auth;

        await wrapper.vm.fetch();

        return wrapper.vm.$apis.entityManagement.get.calledWith('topic', '01234567890-topic');
      };

      describe('and user is authenticated with "entities" roles including "editor"', () => {
        const $auth = auth.authorized;
        it('requests entity management data', async() => {
          expect(await requestMade($auth)).toBe(true);
        });

        describe('and there is a note in the response', () => {
          const proxy = { id: '#proxy_europeana' };
          const response = { note: 'About the topic', proxies: [proxy] };

          it('stores that the entity is editable', async() => {
            const wrapper = factory(topicEntity);
            wrapper.vm.$auth = $auth;
            wrapper.vm.$apis.entityManagement.get.resolves(response);

            await wrapper.vm.fetch();

            expect(wrapper.vm.$store.commit.calledWith('entity/setEditable', true)).toBe(true);
          });
          it('stores the note as the entity description', async() => {
            const wrapper = factory(topicEntity);
            wrapper.vm.$auth = $auth;
            wrapper.vm.$apis.entityManagement.get.resolves(response);

            await wrapper.vm.fetch();

            expect(wrapper.vm.$store.commit.calledWith('entity/setEntityDescription', response.note)).toBe(true);
          });
          it('stores pertinent data from response entity proxy', async() => {
            const wrapper = factory(topicEntity);
            wrapper.vm.$auth = $auth;
            wrapper.vm.$apis.entityManagement.get.resolves(response);

            await wrapper.vm.fetch();

            expect(wrapper.vm.proxy).toEqual({
              exactMatch: undefined,
              sameAs: undefined,
              note: 'About the topic',
              id: undefined,
              type: undefined
            });
          });
        });
      });

      describe('but user is not authenticated with "entities" roles including "editor"', () => {
        const $auth = auth.unauthorized;
        it('does not request entity management data', async() => {
          expect(await requestMade($auth)).toBe(false);
        });
      });
    });
  });

  describe('beforeRouteLeave', () => {
    it('resets set id and set entity', async() => {
      const to = { name: 'search__eu', fullPath: '/en/search', matched: [{ path: '/en/search' }] };
      const wrapper = factory(topicEntity);

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(wrapper.vm.$store.commit.calledWith('entity/setEntity', null)).toBe(true);
      expect(wrapper.vm.$store.commit.calledWith('entity/setId', null)).toBe(true);
      expect(next.called).toBe(true);
    });
    it('hides search bar when not navigating to search page', async() => {
      const to = { name: 'item___eu', fullPath: '/eu/item/123', matched: [{ path: '/eu/item/123' }] };
      const wrapper = factory(topicEntity);

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(wrapper.vm.$store.commit.calledWith('search/setShowSearchBar', false)).toBe(true);
      expect(next.called).toBe(true);
    });
  });

  describe('computed', () => {
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

    describe('title', () => {
      it('uses the fallback title if no entity is present', () => {
        const wrapper = factory();

        const title = wrapper.vm.title;

        expect(title).toEqual({ code: null, values: [undefined] });
      });

      it('favours the editorial title if present', () => {
        const wrapper = factory(organisationEntity);
        wrapper.setData({ page: { name: 'Editorial name' } });

        const title = wrapper.vm.title.values[0];

        expect(title).toEqual('Editorial name');
      });

      it('uses the native language name for organisations', () => {
        const wrapper = factory(organisationEntity);

        const title = wrapper.vm.title.values[0];

        expect(title).toEqual(organisationEntity.entity.prefLabel.nl);
      });

      it('otherwise localises the prefLabel', () => {
        const wrapper = factory(topicEntity);

        const title = wrapper.vm.title.values[0];

        expect(title).toEqual(topicEntity.entity.prefLabel.en);
      });
    });

    describe('description', () => {
      it('uses the entity note (from Entity Management service), if editable', () => {
        const wrapper = factory({ ...organisationEntity, entityStoreState: { editable: true } });

        const description = wrapper.vm.description.values;

        expect(description).toBe(organisationEntity.entity.note.en);
      });

      it('uses the editorial description, if available', () => {
        const wrapper = factory(organisationEntity);
        wrapper.setData({ page: { description: 'Editorial description' } });

        const description = wrapper.vm.description.values;

        expect(description).toEqual(['Editorial description']);
      });

      it('uses the English prefLabel for an organisation, if non-native', () => {
        const wrapper = factory(organisationEntity);

        const description = wrapper.vm.description.values[0];

        expect(description).toBe(organisationEntity.entity.prefLabel.en);
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

        wrapper.vm.thumbnail;
        expect(wrapper.vm.$apis.entity.imageUrl.called).toBe(true);
      });
    });
    describe('moreInfo', () => {
      it('returns an array with more entity data on organisation pages', () => {
        const wrapper = factory(organisationEntity);

        const moreInfo = wrapper.vm.moreInfo;
        expect(moreInfo[0].value).toBe(organisationEntity.entity.prefLabel.en);
        expect(moreInfo[1].value).toBe(organisationEntity.entity.acronym.en);
        expect(moreInfo[2].value).toBe(organisationEntity.entity.hasAddress.countryName);
        expect(moreInfo[3].value).toBe(organisationEntity.entity.hasAddress.locality);
        expect(moreInfo[4].value).toBe(organisationEntity.entity.homepage);
      });
    });
  });

  describe('relatedCollectionCards', () => {
    afterEach(() => {
      contentfulQueryStub.resolves(contentfulPageResponse);
    });
    describe('when there are related collections', () => {
      it('formats and returns the cards', async() => {
        const contentfulPageResponseWithRelatedOverrides = {
          data: {
            data: {
              entityPage: {
                items: [
                  {
                    hasPartCollection: {
                      items: []
                    },
                    relatedLinksCollection: {
                      items: [
                        {
                          identifier: 'http://data.europeana.eu/concept/48',
                          name: 'Photograph',
                          nameEN: 'Photograph',
                          image: 'Contentful image object'
                        }
                      ]
                    }
                  }
                ]
              },
              curatedEntities: {
                items: [{ identifier: topicEntity.entity.id }]
              }
            }
          }
        };
        contentfulQueryStub.resolves(contentfulPageResponseWithRelatedOverrides);
        const curatedEntities = [{ identifier: topicEntity.entity.id }];
        const wrapper = factory(topicEntity);
        wrapper.vm.$store.state.entity.curatedEntities = curatedEntities;

        await wrapper.vm.fetch();

        expect(wrapper.vm.relatedCollectionCards).toStrictEqual([
          {
            id: 'http://data.europeana.eu/concept/48',
            prefLabel: { en: 'Photograph' },
            image: 'Contentful image object'
          }
        ]);
      });
    });

    describe('when there are no related collections', () => {
      it('returns null', () => {
        const wrapper = factory(topicEntity);

        expect(wrapper.vm.relatedCollectionCards).toBe(null);
      });
    });
  });

  describe('methods', () => {
    describe('redirectToPrefPath', () => {
      const redirectIssued = async({ data, entity, pathMatch, serverOrClient = 'server' }) => {
        if (serverOrClient === 'server') {
          process.server = true;
          process.client = false;
        } else {
          process.server = false;
          process.client = true;
        }

        const wrapper = factory(topicEntity);
        await wrapper.setData(data || {});
        entity && (wrapper.vm.$store.state.entity.entity = entity);
        wrapper.vm.$route.params.pathMatch = pathMatch;

        await wrapper.vm.redirectToPrefPath();

        if (process.server) {
          return wrapper.vm.$nuxt.context.redirect.calledWith(302, '/');
        } else {
          return wrapper.vm.$nuxt.context.app.router.replace.calledWith('/');
        }
      };

      for (const serverOrClient of ['server', 'client']) {
        const redirectOrReplace = serverOrClient === 'server' ? 'redirect' : 'replace';

        describe(`${serverOrClient}-side`, () => {
          describe('when entity has a named collection page', () => {
            const data = { page: { name: 'Geography', nameEN: 'Geography', hasPartCollection: { items: [] } } };

            describe('and URL slug already uses the name', () => {
              const pathMatch = '01234567890-geography';
              it(`does not ${redirectOrReplace}`, async() => {
                expect(await redirectIssued({ data, pathMatch, serverOrClient })).toBe(false);
              });
            });

            describe('and URL slug does not use the name', () => {
              const pathMatch = '01234567890-geo';
              it(`${redirectOrReplace}s`, async() => {
                expect(await redirectIssued({ data, pathMatch, serverOrClient })).toBe(true);
              });
            });
          });

          describe('when using another locale and the entity has a named collection page', () => {
            const data = { page: { name: 'Geographie', nameEN: 'Geography', hasPartCollection: { items: [] } } };

            describe('and URL slug already uses the english name', () => {
              const pathMatch = '01234567890-geography';
              it(`does not ${redirectOrReplace}`, async() => {
                expect(await redirectIssued({ data, pathMatch, serverOrClient })).toBe(false);
              });
            });

            describe('and URL slug does not use the english name', () => {
              const pathMatch = '01234567890';
              it(`${redirectOrReplace}s`, async() => {
                expect(await redirectIssued({ data, pathMatch, serverOrClient })).toBe(true);
              });
            });
          });

          describe('when entity has no named collection page, but an English prefLabel', () => {
            const entity = { ...topicEntity.entity, prefLabel: { en: 'Geography' } };

            describe('and URL slug already uses the name', () => {
              const pathMatch = '01234567890-geography';
              it(`does not ${redirectOrReplace}`, async() => {
                expect(await redirectIssued({ pathMatch, entity, serverOrClient })).toBe(false);
              });
            });

            describe('and URL slug does not use the name', () => {
              const pathMatch = '01234567890-geo';
              it(`${redirectOrReplace}s`, async() => {
                expect(await redirectIssued({ pathMatch, entity, serverOrClient })).toBe(true);
              });
            });
          });
        });
      }
    });

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

    describe('proxyUpdated', () => {
      it('triggers $fetch', () => {
        const wrapper = factory(topicEntity);
        sinon.spy(wrapper.vm, '$fetch');

        wrapper.vm.proxyUpdated();

        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });

  describe('the head title', () => {
    describe('when fetchState has error', () => {
      it('uses translation of "Error"', () => {
        const wrapper = factory({ ...topicEntity, mocks: { $fetchState: { error: true } } });

        const headTitle = wrapper.vm.head().title;

        expect(headTitle).toBe('error');
      });
    });

    describe('when fetchState has no error', () => {
      it('uses entity title', () => {
        const wrapper = factory(topicEntity);

        const headTitle = wrapper.vm.head().title;

        expect(headTitle).toBe('Topic');
      });
    });
  });
});
