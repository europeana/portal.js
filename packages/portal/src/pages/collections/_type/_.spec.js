import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import nock from 'nock';
import sinon from 'sinon';

import collection from '@/pages/collections/_type/_';

const localVue = createLocalVue();
localVue.directive('masonry-tile', {});
localVue.use(BootstrapVue);

const redirectSpy = sinon.spy();

const organisationEntity = {
  entity: {
    id: 'http://data.europeana.eu/organization/01234567890',
    prefLabel: { en: 'English name', nl: 'Dutch name' },
    description: { en: ['example of an organisation description'] }
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
  data() {
    return {
      entity: options.entity
    };
  },
  mocks: {
    $auth: {
      userHasClientRole: options.userHasClientRoleStub || sinon.stub().returns(false)
    },
    $fetchState: {},
    $t: (key, args) => args ? `${key} ${args}` : key,
    $route: {
      query: options.query || '',
      params: { type: options.type, pathMatch: options.pathMatch }
    },
    $apis: {
      entity: {
        get: options.get || sinon.stub().resolves(options.entity)
      },
      set: {
        get: sinon.stub().resolves({}),
        getItemIds: sinon.stub().resolves([]),
        search: sinon.stub().resolves({})
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
    $nuxt: {
      context: {
        redirect: redirectSpy
      }
    },
    $store: {
      state: {
        entity: {},
        search: {
          view: 'grid'
        }
      },
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
      template: `
        <div>
          <slot />
          <slot name="card-group-header" />
          <slot name="card-group-related-collections" />
          <slot name="after-results" />
        </div>
      `
    }
  }
});

describe('pages/collections/_type/_', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

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
      it('searches for the EntityBestItemsSet', async() => {
        const setId = 'http://data.europeana.eu/set/123';
        const userHasClientRoleStub = sinon.stub().withArgs('entities', 'editor').returns(true);
        const wrapper = factory({ ...topicEntity, userHasClientRoleStub });
        wrapper.vm.$apis.set.search.resolves({ items: [setId] });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.calledWith({
          profile: 'items',
          query: 'type:EntityBestItemsSet',
          qf: `subject:${topicEntity.entity.id}`
        })).toBe(true);
      });

      describe('when one is found', () => {
        it('also fetches the full set', async() => {
          const setId = 'http://data.europeana.eu/set/123';
          const userHasClientRoleStub = sinon.stub().withArgs('entities', 'editor').returns(true);
          const wrapper = factory({ ...topicEntity, userHasClientRoleStub });
          wrapper.vm.$apis.set.search.resolves({ items: [setId] });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$apis.set.get.calledWith(setId)).toBe(true);
          expect(wrapper.vm.$apis.set.getItemIds.calledWith(setId)).toBe(true);
        });
      });

      describe('when none is found', () => {
        it('does not try to fetch the full set', async() => {
          const userHasClientRoleStub = sinon.stub().withArgs('entities', 'editor').returns(true);
          const wrapper = factory({ ...topicEntity, userHasClientRoleStub });
          wrapper.vm.$apis.set.search.resolves({ items: [] });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$apis.set.get.called).toBe(false);
          expect(wrapper.vm.$apis.set.getItemIds.called).toBe(false);
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

    describe('collectionType', () => {
      it('returns the collection type', () => {
        const wrapper = factory(organisationEntity);

        const collectionType = wrapper.vm.collectionType;
        expect(collectionType).toBe('organisation');
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
  });

  describe('redirecting for slug labels', () => {
    describe('when entity has an English prefLabel', () => {
      describe('and path matches it', () => {
        it('does not redirect', async() => {
          const wrapper = factory(topicEntity);

          await wrapper.vm.fetch();

          expect(redirectSpy.called).toBe(false);
        });
      });

      describe('and path does not match it', () => {
        it('redirects to use english prefLabel in path', async() => {
          const wrapper = factory({ ...topicEntity, pathMatch: '01234567890' });

          await wrapper.vm.fetch();

          expect(redirectSpy.calledWith(302,
            {
              hash: '',
              name: '',
              params: { type: 'topic', pathMatch: '01234567890-topic' },
              query: {},
              replace: true
            })
          ).toBe(true);
        });
      });
    });
  });

  describe('event handling', () => {
    describe('when EntityUpdateModal emits updated event', () => {
      it('triggers $fetch', () => {
        const wrapper = factory(topicEntity);
        sinon.spy(wrapper.vm, '$fetch');

        const entityHeaderStub = wrapper.find('entityheader-stub');
        entityHeaderStub.vm.$emit('updated');

        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });

  describe('methods', () => {
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
