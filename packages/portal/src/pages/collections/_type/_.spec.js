import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
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
    prefLabel: { en: 'English name', nl: 'Dutch name' },
    homepage: 'https://www.example-organisation.eu',
    hasAddress: {
      countryName: 'The Netherlands',
      locality: 'The Hague'
    },
    description: { en: ['example of an organisation description'] },
    acronym: { en: 'ABC' },
    type: 'Organization'
  },
  type: 'organisation',
  pathMatch: '01234567890-organisation'
};

const topicEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/01234567890',
    note: { en: ['example of a topic note'] },
    isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail.jpg' },
    prefLabel: { en: 'Topic' },
    type: 'Concept'
  },
  type: 'topic',
  pathMatch: '01234567890-topic'
};

const agentEntity = {
  entity: {
    id: 'http://data.europeana.eu/concept/60305',
    type: 'Agent',
    prefLabel: {
      en: 'William Shakespeare'
    }
  },
  type: 'person',
  pathMatch: '60305-william-shakespeare'
};

const factory = (options = {}) => shallowMountNuxt(collection, {
  localVue,
  mocks: {
    $auth: {
      userHasClientRole: options.userHasClientRoleStub || sinon.stub().returns(false)
    },
    $fetchState: {},
    $t: (key, args) => args ? `${key} ${args}` : key,
    $route: { query: options.query || '', params: { type: options.type, pathMatch: options.pathMatch } },
    $apis: {
      entity: {
        get: options.get || sinon.stub().resolves({}),
        facets: sinon.stub().resolves([]),
        imageUrl: sinon.spy()
      },
      entityManagement: {
        get: sinon.stub().resolves({})
      }
    },
    $i18n: {
      locale: 'en'
    },
    localePath: sinon.stub().returns('/'),
    $error: sinon.spy(),
    $config: {
      app: {
        search: {
          collections: {}
        }
      }
    },
    $store: {
      state: {
        entity: {
          entity: options.entity
        },
        search: {
          view: 'grid'
        }
      },
      getters: {
        'entity/curatedEntity': sinon.stub().returns(null)
      },
      dispatch: sinon.spy(),
      commit: sinon.spy()
    },
    ...options.mocks
  },
  stubs: {
    'client-only': true,
    'EntityHeader': true,
    'EntityRelatedCollectionsCard': true,
    'ErrorMessage': true,
    'RelatedEditorial': true,
    'SearchInterface': {
      template: '<div><slot /><slot name="card-group-related-collections" /><slot name="after-results" /></div>'
    }
  }
});

describe('pages/collections/_type/_', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when entity type in route is invalid', () => {
      const type = 'train';

      it('triggers 404 error via $error', async() => {
        const wrapper = factory({ type });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.calledWith(404, { scope: 'page' })).toBe(true);
      });

      it('does not request entity from Entity API', async() => {
        const wrapper = factory({ type });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.get.called).toBe(false);
      });
    });

    describe('when entity ID in route is invalid', () => {
      const type = 'topic';
      const pathMatch = 'undefined';

      it('triggers 404 error via $error', async() => {
        const wrapper = factory({ type, pathMatch });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.calledWith(404, { scope: 'page' })).toBe(true);
      });

      it('does not request entity from Entity API', async() => {
        const wrapper = factory({ type, pathMatch });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.entity.get.called).toBe(false);
      });
    });

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

    describe('on errors', () => {
      it('handles errors via $error', async() => {
        const apiError = new Error({ message: 'No collection found' });
        const wrapper = factory({ ...topicEntity, get: sinon.stub().rejects(apiError) });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$error.calledWith(apiError)).toBe(true);
      });
    });

    describe('when user is entities editor', () => {
      it('finds and stores the collection\'s pinned items', async() => {
        const setId = 'http://data.europeana.eu/set/123';
        const userHasClientRoleStub = sinon.stub().withArgs('entities', 'editor').returns(true);
        const wrapper = factory({ ...topicEntity, userHasClientRoleStub });
        sinon.stub(wrapper.vm, 'findEntityBestItemsSet').resolves(setId);
        sinon.stub(wrapper.vm, 'fetchEntityBestItemsSetPinnedItems');

        await wrapper.vm.fetch();

        expect(wrapper.vm.findEntityBestItemsSet.calledWith(topicEntity.entity.id)).toBe(true);
        expect(wrapper.vm.$store.commit.calledWith('entity/setBestItemsSetId', setId)).toBe(true);
        expect(wrapper.vm.fetchEntityBestItemsSetPinnedItems.calledWith(setId)).toBe(true);
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
    describe('editable', () => {
      const editableOptions = {
        ...organisationEntity,
        userHasClientRoleStub: sinon.stub().returns(false)
          .withArgs('entities', 'editor').returns(true)
      };

      it('is truthy if all criteria are met', () => {
        const wrapper = factory(editableOptions);

        const editable = wrapper.vm.editable;

        expect(editable).toBeTruthy();
      });

      it('is falsy if entity is absent', () => {
        const wrapper = factory({
          ...editableOptions,
          entity: null
        });

        const editable = wrapper.vm.editable;

        expect(editable).toBeFalsy();
      });

      it('is falsy if user is unauthorized', () => {
        const wrapper = factory({
          ...editableOptions,
          userHasClientRoleStub: sinon.stub().returns(false)
        });

        const editable = wrapper.vm.editable;

        expect(editable).toBeFalsy();
      });

      it('is falsy if entity is not organisation or topic', () => {
        const wrapper = factory({
          ...editableOptions,
          ...agentEntity
        });

        const editable = wrapper.vm.editable;

        expect(editable).toBeFalsy();
      });
    });

    describe('contextLabel', () => {
      it('returns the label for an organisation', () => {
        const wrapper = factory(organisationEntity);

        const contextLabel = wrapper.vm.contextLabel;
        expect(contextLabel).toBe('cardLabels.organisation');
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

    describe('subTitle', () => {
      it('uses the English prefLabel for an organisation, if non-native', () => {
        const wrapper = factory(organisationEntity);

        const subTitle = wrapper.vm.subTitle.values[0];

        expect(subTitle).toBe(organisationEntity.entity.prefLabel.en);
      });
    });

    describe('description', () => {
      it('uses the entity note, if present', () => {
        const wrapper = factory(topicEntity);

        const description = wrapper.vm.description.values;

        expect(description).toEqual(topicEntity.entity.note.en);
      });

      it('uses the entity description, if present', () => {
        const wrapper = factory(organisationEntity);

        const description = wrapper.vm.description.values;

        expect(description).toEqual(organisationEntity.entity.description.en);
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

  describe('redirecting for slug labels', () => {
    describe('when entity has an English prefLabel', () => {
      it('uses the english prefLabel', async() => {
        const wrapper = factory(topicEntity);

        sinon.spy(wrapper.vm, 'redirectToPrefPath');

        await wrapper.vm.fetch();
        expect(wrapper.vm.redirectToPrefPath.calledWith('http://data.europeana.eu/concept/01234567890', 'Topic')).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('proxyUpdated', () => {
      it('triggers $fetch', () => {
        const wrapper = factory(topicEntity);
        sinon.spy(wrapper.vm, '$fetch');

        wrapper.vm.proxyUpdated();

        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });

    describe('handleEntityRelatedCollectionsCardFetched', () => {
      it('is triggered by entitiesFromUrisFetched event on related entities component', () => {
        const wrapper = factory(topicEntity);
        const relatedCollections = [{ id: 'http://data.europeana.eu/concept/3012' }];

        const relatedEntitiesComponent = wrapper.find('[data-qa="related entities"]');
        relatedEntitiesComponent.vm.$emit('entitiesFromUrisFetched', relatedCollections);

        expect(wrapper.vm.relatedCollections).toEqual(relatedCollections);
      });
    });
  });

  describe('the head title', () => {
    describe('when fetchState has no error', () => {
      it('uses entity title', () => {
        const wrapper = factory(topicEntity);

        const headTitle = wrapper.vm.pageMeta.title;

        expect(headTitle).toBe('Topic');
      });
    });
  });
});
