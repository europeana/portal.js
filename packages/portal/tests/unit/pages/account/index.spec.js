import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/account/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  stubs: ['client-only'],
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
    $route: {
      hash: options.hash || '',
      query: {}
    },
    $store: {
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

describe('pages/account/index.vue', () => {
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
        const wrapper = factory({
          hash: '#curated-collections',
          userHasClientRoleStub
        });

        const publicGalleries = wrapper.find('[data-qa="curated sets"]');

        expect(publicGalleries.exists()).toBe(true);
      });
    });
  });

  describe('when visiting the likes collection', () => {
    const wrapper = factory({
      hash: '#likes'
    });

    it('shows the liked items', () => {
      const likedItems = wrapper.find('[data-qa="liked items"]');
      expect(likedItems.exists()).toBe(true);
    });
  });

  describe('when visiting the public galleries', () => {
    const wrapper = factory({
      hash: '#public-galleries'
    });

    it('shows the public galleries', () => {
      const publicGalleries = wrapper.find('[data-qa="public sets"]');
      expect(publicGalleries.exists()).toBe(true);
    });
  });

  describe('when visiting the private galleries', () => {
    const wrapper = factory({
      hash: '#private-galleries'
    });

    it('shows the private galleries', () => {
      const privateGalleries = wrapper.find('[data-qa="private sets"]');
      expect(privateGalleries.exists()).toBe(true);
    });
  });
});
