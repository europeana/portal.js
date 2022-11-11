// TODO: Move this file to the _.spec.js when contentful galleries are deprecated.
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/galleries/_';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

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
  total: 1,
  items: [{ id: '001', edmPreview: ['https://www.example.eu'] }]
};

const testSet2 = {
  id: '234',
  title: { en: 'My set' },
  description: { en: 'A test set' },
  creator: 'http://data.europeana.eu/user/0123',
  type: 'Collection',
  total: 1000
};

const testSetCreator = { loggedIn: true, user: { sub: '0123' } };

const entityEditor = {
  loggedIn: true,
  user: {
    'resource_access': {
      entities: { roles: ['editor'] },
      usersets: { roles: ['editor'] }
    }
  }
};

const defaultOptions = {
  set: testSet1,
  user: { loggedIn: false },
  fetchState: { pending: false }
};

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $features: { setGalleries: true, ...options.features },
    $pageHeadTitle: key => key,
    $t: key => key,
    $tc: key => key,
    $i18n,
    $auth: {
      loggedIn: true
    },
    $fetchState: options.fetchState || {},
    $route: {
      params: {
        pathMatch: (options.set?.id || '111') + '-my-set'
      }
    },
    $store: {
      commit: storeCommit,
      dispatch: storeDispatch,
      state: {
        auth: options.user || {},
        set: { active: options.set || null }
      }
    },
    $apis: {
      thumbnail: {
        edmPreview: () => ''
      }
    },
    $nuxt: {
      context: {
        res: {}
      }
    }
  },
  stubs: ['SetRecommendations']
});

describe('SetPage', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('validates the format of the Set ID', async() => {
      const wrapper = factory({ fetchState: { pending: true }, set: { id: 'nope' } });

      let error;
      try {
        await wrapper.vm.fetch();
      } catch (e) {
        error = e;
      }

      expect(error.statusCode).toBe(400);
      expect(storeDispatch.called).toBe(false);
    });

    it('fetches the active set', async() => {
      const wrapper = factory(defaultOptions);

      await wrapper.vm.fetch();

      expect(storeDispatch.calledWith('set/fetchActive', '123')).toBe(true);
    });

    describe('on errors', () => {
      it('set the status code on SSRs', async() => {
        const wrapper = factory();
        process.server = true;
        wrapper.vm.$store.dispatch = sinon.stub().throws(() => new Error('Internal Server Error'));

        let error;
        try {
          await wrapper.vm.fetch();
        } catch (e) {
          error = e;
        }

        expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(500);
        expect(error.message).toBe('Internal Server Error');
      });

      it('displays an illustrated error message for 403 status', async() => {
        const unauthorisedError = { statusCode: 403, message: 'Unauthorised' };
        const wrapper = factory();
        process.server = true;
        wrapper.vm.$store.dispatch = sinon.stub().throws(() => unauthorisedError);
        wrapper.vm.$fetchState.error = unauthorisedError;

        let error;
        try {
          await wrapper.vm.$fetch();
        } catch (e) {
          error = e;
        }

        expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(403);
        expect(error.titlePath).toBe('errorMessage.galleryUnauthorised.title');
        expect(error.illustrationSrc).toBe('il-gallery-unauthorised.svg');
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

        const loadingSpinner = wrapper.find('[data-qa="loading spinner container"]');

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
      const wrapper = factory({ set: testSet1, user: testSetCreator });

      it('the set is editable', () => {
        const editButton = wrapper.find('[data-qa="edit set button"]');

        expect(editButton.exists()).toBe(true);
      });
    });

    describe('when user is entity editor and set is a curated collection', () => {
      const testSetEntityBestItems = { ...testSet1, type: 'EntityBestItemsSet' };
      const wrapper = factory({ set: testSetEntityBestItems, user: entityEditor });

      it('gets the pinned items', async() => {
        await wrapper.vm.fetch();

        expect(storeDispatch.calledWith('entity/getPins')).toBe(true);
      });

      describe('when accept entity recommendations is enabled', () => {
        const wrapper = factory({ set: testSetEntityBestItems, user: entityEditor, features: { acceptEntityRecommendations: true } });

        it('renders the recommendations', () => {
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
    describe('reorderItems', () => {
      it('updates the set with new item order', async() => {
        const wrapper = factory({
          ...defaultOptions,
          set: {
            ...defaultOptions.set,
            items: [
              { id: '/123/abc' },
              { id: '/123/def' }
            ]
          }
        });

        await wrapper.vm.reorderItems([
          { id: '/123/def' },
          { id: '/123/abc' }
        ]);

        expect(storeDispatch.calledWith('set/update', {
          id: `http://data.europeana.eu/set/${defaultOptions.set.id}`,
          body: {
            type: defaultOptions.set.type,
            title: defaultOptions.set.title,
            description: defaultOptions.set.description,
            visibility: defaultOptions.set.visibility,
            items: [
              'http://data.europeana.eu/item/123/def',
              'http://data.europeana.eu/item/123/abc'
            ]
          },
          params: {
            profile: 'standard'
          }
        })).toBe(true);
      });
    });
  });
});
