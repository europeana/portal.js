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
    homepage: 'https://www.example-organisation.eu',
    hasAddress: {
      countryName: 'The Netherlands',
      locality: 'The Hague'
    },
    acronym: { en: 'ABC' }
  },
  type: 'organisation',
  pathMatch: '01234567890-organisation'
};

const topicEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/base/01234567890',
    description: { en: 'example of a topic description' },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' },
    prefLabel: { en: 'Topic' }
  },
  type: 'topic',
  pathMatch: '01234567890-topic'
};

const themeEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/base/62',
    description: { en: 'example of a theme description' },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' },
    prefLabel: { en: 'Theme' }
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

const factory = (options = {}) => shallowMountNuxt(collection, {
  localVue,
  mocks: {
    $fetchState: {},
    $t: key => key,
    $tc: (key) => key,
    $te: () => true,
    $route: { query: '', params: { type: options.type, pathMatch: options.pathMatch } },
    $contentful: {
      query: sinon.stub().resolves(contentfulPageResponse)
    },
    $apis: {
      entity: {
        get: sinon.stub().resolves({}),
        facets: sinon.stub().resolves([])
      },
      entityManagement: {
        get: sinon.stub().resolves({})
      },
      record: {
        relatedEntities: sinon.stub().resolves({})
      }
    },
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $features: { sideFilters: false },
    $path: () => '/',
    $nuxt: { context: { redirect: sinon.spy() } },
    $store: {
      state: {
        entity: {
          entity: options.entity
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
    }
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
      }

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
      const features = {
        enabled: { entityManagement: true },
        disabled: { entityManagement: false }
      };
      const auth = {
        authorized: { user: { 'resource_access': { entities: { roles: ['editor'] } } } },
        unauthorized: { user: { 'resource_access': { entities: { roles: [] } } } }
      };
      const requestMade = async($features, $auth) => {
        const wrapper = factory(topicEntity);
        wrapper.vm.$features = $features;
        wrapper.vm.$auth = $auth;

        await wrapper.vm.fetch();

        return wrapper.vm.$apis.entityManagement.get.calledWith('topic', '01234567890-topic');
      };

      describe('when feature is enabled', () => {
        const $features = features.enabled;

        describe('and user is authenticated with "entities" roles including "editor"', () => {
          const $auth = auth.authorized;
          it('requests entity management data', async() => {
            expect(await requestMade($features, $auth)).toBe(true);
          });

          describe('and there is a note in the response', () => {
            const proxy = { id: '#proxy_europeana' };
            const response = { note: 'About the topic', proxies: [proxy] };

            it('stores that the entity is editable', async() => {
              const wrapper = factory(topicEntity);
              wrapper.vm.$features = $features;
              wrapper.vm.$auth = $auth;
              wrapper.vm.$apis.entityManagement.get.resolves(response);

              await wrapper.vm.fetch();

              expect(wrapper.vm.$store.commit.calledWith('entity/setEditable', true)).toBe(true);
            });
            it('stores the note as the entity description', async() => {
              const wrapper = factory(topicEntity);
              wrapper.vm.$features = $features;
              wrapper.vm.$auth = $auth;
              wrapper.vm.$apis.entityManagement.get.resolves(response);

              await wrapper.vm.fetch();

              expect(wrapper.vm.$store.commit.calledWith('entity/setEntityDescription', response.note)).toBe(true);
            });
            it('stores the Europeana proxy as the entity proxy', async() => {
              const wrapper = factory(topicEntity);
              wrapper.vm.$features = $features;
              wrapper.vm.$auth = $auth;
              wrapper.vm.$apis.entityManagement.get.resolves(response);

              await wrapper.vm.fetch();

              expect(wrapper.vm.$store.commit.calledWith('entity/setProxy', response.proxies[0])).toBe(true);
            });
          });
        });

        describe('but user is not authenticated with "entities" roles including "editor"', () => {
          const $auth = auth.unauthorized;
          it('does not request entity management data', async() => {
            expect(await requestMade($features, $auth)).toBe(false);
          });
        });
      });

      describe('when feature is disabled', () => {
        const $features = features.disabled;

        describe('and user is authenticated with "entities" roles including "editor"', () => {
          const $auth = auth.authorized;
          it('does not request entity management data', async() => {
            expect(await requestMade($features, $auth)).toBe(false);
          });
        });

        describe('but user is not authenticated with "entities" roles including "editor"', () => {
          const $auth = auth.unauthorized;
          it('does not request entity management data', async() => {
            expect(await requestMade($features, $auth)).toBe(false);
          });
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
    describe('redirectToPrefPath', () => {
      const redirectIssued = async({ data, entity, pathMatch }) => {
        const wrapper = factory(topicEntity);
        wrapper.setData(data);
        entity && (wrapper.vm.$store.state.entity.entity = entity);
        wrapper.vm.$route.params.pathMatch = pathMatch;

        await wrapper.vm.fetch();

        return wrapper.vm.$nuxt.context.redirect.calledWith(302, '/');
      }

      describe('when entity has a named collection page', () => {
        const data = { page: { name: 'Topic' } };

        describe('and URL slug already uses the name', () => {
          const pathMatch = '01234567890-topic';
          it('does not redirect', async() => {
            expect(await redirectIssued({ data, pathMatch })).toBe(false);
          });
        });

        describe('and URL slug does not use the name', () => {
          const pathMatch = '01234567890-top';
          it('redirects', async() => {
            expect(await redirectIssued({ data, pathMatch })).toBe(true);
          });
        });
      });

      describe('when entity has no named collection page, but an English prefLabel', () => {
        const data = { page: { name: null } };
        const entity = topicEntity.entity;

        describe('and URL slug already uses the name', () => {
          const pathMatch = '01234567890-topic';
          it('does not redirect', async() => {
            expect(await redirectIssued({ data, pathMatch, entity })).toBe(false);
          });
        });

        describe('and URL slug does not use the name', () => {
          const pathMatch = '01234567890-top';
          it('redirects', async() => {
            expect(await redirectIssued({ data, pathMatch, entity })).toBe(true);
          });
        });
      });
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
  });
});
