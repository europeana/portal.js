import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/galleries/_';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setApiRepositionItemStub = sinon.stub().resolves({});
const storeDispatch = sinon.stub().resolves({});
const storeCommit = sinon.spy();

const $i18n = {
  locale: 'en'
};

const testSet1 = {
  id: '123',
  title: { en: 'My set' },
  description: { en: 'A test set' },
  creator: { id: 'http://data.europeana.eu/user/0123', nickname: 'Tester' },
  type: 'Collection',
  visibility: 'public',
  total: 1,
  items: [{ id: '001', edmPreview: ['https://www.example.eu'] }]
};

const testSet2 = {
  id: '234',
  title: { en: 'My published set' },
  description: { en: 'A test set' },
  creator: 'http://data.europeana.eu/user/0123',
  type: 'Collection',
  visibility: 'published',
  total: 1000
};

const testSetCreator = { loggedIn: true, user: { sub: '0123' } };

const defaultOptions = {
  set: testSet1,
  user: { loggedIn: false },
  fetchState: { pending: false }
};

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $features: options.features || {},
    $t: key => key,
    $tc: key => key,
    $i18n,
    $auth: {
      ...options.user || {},
      userHasClientRole: options.userHasClientRoleStub || sinon.stub().returns(false)
    },
    $fetchState: options.fetchState || {},
    $route: {
      params: {
        pathMatch: (options.set?.id || '111') + '-my-set'
      },
      query: {}
    },
    $store: {
      commit: storeCommit,
      dispatch: storeDispatch,
      getters: {},
      state: {
        set: { active: options.set || null }
      }
    },
    $apis: {
      set: {
        repositionItem: setApiRepositionItemStub
      },
      thumbnail: {
        edmPreview: () => ''
      }
    },
    $error: sinon.spy(),
    $config: {
      app: {
        galleries: {
          europeanaAccount: 'europeana'
        }
      }
    }
  },
  stubs: [
    'ErrorMessage',
    'LoadingSpinner',
    'SetFormModal',
    'SetPublicationRequestWidget',
    'SetPublishButton',
    'SetRecommendations'
  ]
});

describe('GalleryPage (Set)', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('validates the format of the Set ID', async() => {
      const wrapper = factory({ fetchState: { pending: true }, set: { id: 'nope' } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$error.calledWith(404)).toBe(true);
    });

    it('fetches the active set', async() => {
      const wrapper = factory(defaultOptions);

      await wrapper.vm.fetch();

      expect(storeDispatch.calledWith('set/fetchActive', '123')).toBe(true);
    });

    describe('on errors', () => {
      it('calls $error', async() => {
        const unauthorisedError = { statusCode: 403, message: 'Unauthorised' };
        const wrapper = factory();
        wrapper.vm.$store.dispatch = sinon.stub().throws(() => unauthorisedError);

        await wrapper.vm.$fetch();

        expect(wrapper.vm.$error.called).toBe(true);
      });
    });
  });

  describe('computed properties', () => {
    describe('weaveUrl', () => {
      it('uses the setId', () => {
        const wrapper = factory(defaultOptions);

        expect(wrapper.vm.weaveUrl).toEqual('https://experience.weave-culture.eu/import/europeana/set/123');
      });
    });
  });

  describe('template', () => {
    describe('item count heading', () => {
      describe('when less than max amount of items in set', () => {
        it('displays the amount of items in the set', () => {
          const wrapper = factory(defaultOptions);
          const itemCount = wrapper.find('[data-qa="item count"]');

          expect(itemCount.text()).toEqual('items.itemCount');
        });
      });

      describe('when more than max amount of items in set', () => {
        it('displays the amount shown in total of items in the set', () => {
          const wrapper = factory({ set: testSet2 });
          const itemCount = wrapper.find('[data-qa="item count"]');

          expect(itemCount.text()).toEqual('items.itemOf');
        });
      });
    });

    describe('while fetching the set', () => {
      it('shows a loading spinner', async() => {
        const wrapper = factory({ fetchState: { pending: true } });

        const loadingSpinner = wrapper.find('loadingspinner-stub');

        expect(loadingSpinner.exists()).toBe(true);
      });
    });

    describe('when something goes wrong while fetching the set', () => {
      const wrapper = factory({ fetchState: { error: { message: 'Something went wrong' } } });

      it('shows an error message', async() => {
        const errorMessage = wrapper.find('[data-qa="error message container"]');

        expect(errorMessage.exists()).toBe(true);
      });
    });

    describe('when the user is the set\'s owner', () => {
      it('the set is editable', () => {
        const wrapper = factory({ set: testSet1, user: testSetCreator });
        const editButton = wrapper.find('[data-qa="edit set button"]');

        expect(editButton.exists()).toBe(true);
      });

      describe('and the set is public', () => {
        it('the set can be submitted for publication', () => {
          const wrapper = factory({ set: testSet1, user: testSetCreator });

          const submitForPublicationButton = wrapper.find('[data-qa="set request publication button"]');

          expect(submitForPublicationButton.exists()).toBe(true);
        });
      });
    });

    describe('when the user is a publisher', () => {
      const userHasClientRoleStub = sinon.stub().returns(false)
        .withArgs('usersets', 'editor').returns(true);
      const wrapper = factory({ set: testSet2, userHasClientRoleStub });

      it('the set is editable', () => {
        const editButton = wrapper.find('[data-qa="edit set button"]');

        expect(editButton.exists()).toBe(true);
      });
    });

    describe('when user is entity editor and set is a curated collection', () => {
      const testSetEntityBestItems = { ...testSet1, type: 'EntityBestItemsSet' };
      const userHasClientRoleStub = sinon.stub().returns(false)
        .withArgs('entities', 'editor').returns(true)
        .withArgs('usersets', 'editor').returns(true);

      it('gets the pinned items', async() => {
        const wrapper = factory({
          set: testSetEntityBestItems,
          user: { loggedIn: true },
          userHasClientRoleStub
        });

        await wrapper.vm.fetch();

        expect(storeCommit.calledWith('entity/setBestItemsSetId', testSetEntityBestItems.id)).toBe(true);
        expect(storeCommit.calledWith('entity/setPinned', sinon.match.array)).toBe(true);
      });

      describe('when accept entity recommendations is enabled', () => {
        it('renders the recommendations', () => {
          const wrapper = factory({
            set: testSetEntityBestItems,
            user: { loggedIn: true },
            userHasClientRoleStub,
            features: { acceptEntityRecommendations: true }
          });

          const recommendations = wrapper.find('setrecommendations-stub');

          expect(recommendations.exists()).toBe(true);
        });
      });
    });
  });

  describe('pageMeta', () => {
    describe('when the set has a description', () => {
      const wrapper = factory(defaultOptions);

      it('is used as the content for the description meta tag', () => {
        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.description).toBe('A test set');
      });
    });

    describe('when the set does NOT have a description', () => {
      const testSetWithoutDescription = { id: 234, title: { en: 'My set' }, creator: { nickname: 'Tester' } };
      const wrapper = factory({ set: testSetWithoutDescription });

      it('omits the description meta tag', () => {
        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.description).toBeUndefined();
      });
    });
  });

  describe('beforeRouteLeave', () => {
    it('resets the active set and recommendations', async() => {
      const to = { name: 'search__eu', fullPath: '/en/search', matched: [{ path: '/en/search' }] };
      const wrapper = factory(defaultOptions);

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(storeCommit.calledWith('set/setActive', null)).toBe(true);
      expect(storeCommit.calledWith('set/setActiveRecommendations', [])).toBe(true);
      expect(next.called).toBe(true);
    });
  });

  describe('methods', () => {
    describe('repositionItem', () => {
      const itemId = '/123/abc';
      const position = 2;

      it('moves the item to the new position via Set API', async() => {
        const wrapper = factory(defaultOptions);

        await wrapper.vm.repositionItem({ itemId, position });

        expect(setApiRepositionItemStub.calledWith(defaultOptions.set.id, itemId, position)).toBe(true);
      });

      it('re-fetches the active set via the store', async() => {
        const wrapper = factory(defaultOptions);

        await wrapper.vm.repositionItem({ itemId, position });

        expect(storeDispatch.calledWith('set/fetchActive', defaultOptions.set.id)).toBe(true);
      });
    });
  });
});
