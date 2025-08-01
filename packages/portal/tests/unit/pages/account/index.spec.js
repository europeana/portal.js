import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import { reactive } from 'vue';
import * as vue2RouterHelpers from 'vue2-helpers/vue-router';

import page from '@/pages/account/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeCommit = sinon.spy();
const storeDispatch = sinon.stub().resolves({});

const factory = (options = {}) => {
  sinon.stub(vue2RouterHelpers, 'useRoute').returns(reactive({ hash: options.hash || '' }));

  return shallowMountNuxt(page, {
    localVue,
    stubs: ['b-nav', 'b-nav-item', 'client-only'],
    mocks: {
      $t: key => key,
      $tc: key => key,
      $auth: {
        userHasClientRole: options.userHasClientRoleStub || sinon.stub().returns(false),
        strategy: {
          options: {
            origin: 'https://auth.example.eu',
            realm: 'europeana',
            'client_id': 'portal.js'
          }
        }
      },
      $config: { app: { baseUrl: 'https://www.example.eu' } },
      $features: {},
      $fetchState: options.fetchState || {},
      $keycloak: { accountUrl: () => '/account' },
      localePath: (path) => path,
      $route: {},
      $store: {
        commit: storeCommit,
        dispatch: storeDispatch,
        getters: {},
        state: {
          auth: { loggedIn: true,
            user: {
              'preferred_username': 'username',
              ...options.user
            } },
          set: {
            creations: [],
            curations: [],
            likedItems: ['http://data.europeana.eu/set/123']
          }
        }
      }
    }
  });
};

describe('pages/account/index.vue', () => {
  afterEach(() => {
    sinon.resetHistory();
    vue2RouterHelpers.useRoute.restore?.();
  });
  afterAll(sinon.restore);

  describe('when visiting the account page', () => {
    it('fetches the likes of the logged in user', () => {
      const wrapper = factory();

      wrapper.vm.fetch();

      expect(wrapper.vm.$store.dispatch.calledWith('set/fetchLikes')).toBe(true);
    });

    it('sets the page meta title to the localised account title key', () => {
      const wrapper = factory();

      expect(wrapper.vm.pageMeta.title).toBe('account.title');
    });
  });

  describe('when the user has the editor role', () => {
    const userHasClientRoleStub = sinon.stub().returns(false)
      .withArgs('entities', 'editor').returns(true)
      .withArgs('usersets', 'editor').returns(true);

    it('shows the curated collections in the tab navigation', () => {
      const wrapper = factory({ userHasClientRoleStub });

      const curatedCollectionsTab = wrapper.find('[data-qa="curated collections"]');

      expect(curatedCollectionsTab.exists()).toBe(true);
    });

    describe('when visiting the curated collections', () => {
      it('shows the curated collections', () => {
        const wrapper = factory({ hash: '#curated-collections', userHasClientRoleStub });

        const curatedCollections = wrapper.find('[data-qa="curated sets"]');

        expect(curatedCollections.exists()).toBe(true);
      });
    });
  });

  describe('when visiting the likes collection', () => {
    it('shows the liked items', () => {
      const wrapper = factory({ hash: '#likes' });

      const likedItems = wrapper.find('[data-qa="liked items"]');

      expect(likedItems.exists()).toBe(true);
    });
  });

  describe('when visiting the public galleries', () => {
    it('shows the public galleries', () => {
      const wrapper = factory({ hash: '#public-galleries' });

      const publicGalleries = wrapper.find('[data-qa="public sets"]');

      expect(publicGalleries.exists()).toBe(true);
    });
  });

  describe('when visiting the private galleries', () => {
    it('shows the private galleries', () => {
      const wrapper = factory({ hash: '#private-galleries' });

      const privateGalleries = wrapper.find('[data-qa="private sets"]');

      expect(privateGalleries.exists()).toBe(true);
    });
  });

  describe('beforeRouteLeave', () => {
    it('resets the active set, recommendations and selected items', async() => {
      const wrapper = factory();
      const to = { name: 'search__eu', fullPath: '/en/search', matched: [{ path: '/en/search' }] };

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(storeCommit.calledWith('set/setSelected', [])).toBe(true);
      expect(next.called).toBe(true);
    });
  });
});
