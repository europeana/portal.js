import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/account/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});

const defaultOptions = {
  fetchState: {},
  hash: ''
};

const factory = (options = defaultOptions) => shallowMountNuxt(page, {
  localVue,
  stubs: ['client-only'],
  mocks: {
    $t: key => key,
    $auth: { strategy: { options: {
      origin: 'https://auth.example.eu', realm: 'europeana', 'client_id': 'portal.js'
    } } },
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    $fetchState: options.fetchState,
    $pageHeadTitle: key => key,
    $path: (path) => path,
    $route: {
      hash: options.hash
    },
    $store: {
      dispatch: storeDispatch,
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
    const wrapper = factory();

    it('fetches the likes of the logged in user', async() => {
      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.dispatch.calledWith('set/fetchLikes')).toBe(true);
    });

    it('sets the head title to the localised account title key', () => {
      expect(wrapper.vm.head().title).toBe('account.title');
    });
  });

  describe('when the user has the editor role', () => {
    const wrapper = factory({
      ...defaultOptions,
      user: {
        'resource_access': { entities: { roles: ['editor'] },
          usersets: { roles: 'editor' } }
      }
    });

    it('fetches the user\'s curated collections', async() => {
      await wrapper.vm.fetch();

      expect(wrapper.vm.$store.dispatch.calledWith('set/fetchCurations')).toBe(true);
    });

    it('shows the curated collections in the tab navigation', () => {
      const curatedCollectionsTab = wrapper.find('[data-qa="curated collections"]');
      expect(curatedCollectionsTab.exists()).toBe(true);
    });

    describe('when visiting the curated collections', () => {
      const wrapper = factory({
        ...defaultOptions,
        hash: '#curated-collections',
        user: {
          'resource_access': { entities: { roles: ['editor'] },
            usersets: { roles: 'editor' } }
        }
      });

      it('shows the curated collections', () => {
        const publicGalleries = wrapper.find('[data-qa="curated sets"]');
        expect(publicGalleries.exists()).toBe(true);
      });
    });
  });

  describe('when visiting the likes collection', () => {
    const wrapper = factory({
      ...defaultOptions,
      hash: '#likes'
    });

    it('shows the liked items', () => {
      const likedItems = wrapper.find('[data-qa="liked items"]');
      expect(likedItems.exists()).toBe(true);
    });
  });

  describe('when visiting the public galleries', () => {
    const wrapper = factory({
      ...defaultOptions,
      hash: '#public-galleries'
    });

    it('shows the public galleries', () => {
      const publicGalleries = wrapper.find('[data-qa="public sets"]');
      expect(publicGalleries.exists()).toBe(true);
    });
  });

  describe('when visiting the private galleries', () => {
    const wrapper = factory({
      ...defaultOptions,
      hash: '#private-galleries'
    });

    it('shows the private galleries', () => {
      const privateGalleries = wrapper.find('[data-qa="private sets"]');
      expect(privateGalleries.exists()).toBe(true);
    });
  });
});
