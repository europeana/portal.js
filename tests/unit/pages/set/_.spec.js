import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/set/_';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});
const storeCommit = sinon.spy();

const $i18n = {
  locale: 'en'
};

const testSet1 = { id: '123',
  title: { en: 'My set' },
  description: { en: 'A test set' },
  creator: { id: 'http://data.europeana.eu/user/0123', nickname: 'Tester' },
  type: 'Collection',
  total: 1,
  items: [{ id: '001', edmPreview: ['https://www.example.eu'] }] };

const testSet2 = { id: '234',
  title: { en: 'My set' },
  description: { en: 'A test set' },
  creator: 'http://data.europeana.eu/user/0123',
  type: 'Collection',
  total: 1000 };

const testSetCreator = { loggedIn: true, user: { sub: '0123' } };

const entityEditor = { loggedIn: true,
  user: {
    'resource_access': {
      entities: { roles: ['editor'] },
      usersets: { roles: ['editor'] }
    }
  } };

const defaultOptions = {
  set: testSet1,
  user: { loggedIn: false },
  fetchState: { pending: false }
};

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $features: options.features || {},
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
        pathMatch: options.set?.id || '111'
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
    }
  },
  stubs: ['SetRecommendations']
});

describe('Set page', () => {
  it('fetches the active set', async() => {
    const wrapper = factory(defaultOptions);

    await wrapper.vm.fetch();

    expect(storeDispatch.calledWith('set/fetchActive', '123')).toBe(true);
  });

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

    it('shows an alert message', async() => {
      const alertMessage = wrapper.find('[data-qa="alert message container"]');

      expect(alertMessage.exists()).toBe(true);
    });
    it('sets the head title and meta tag titles', () => {
      const headTitle = wrapper.vm.head().title;
      const headMeta = wrapper.vm.head().meta;

      expect(headTitle).toEqual('error');
      expect(headMeta.find(meta => meta.name === 'title').content).toEqual('error');
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

  describe('head()', () => {
    describe('when the set has a description', () => {
      const wrapper = factory(defaultOptions);

      it('is used as the content for the description meta tag', () => {
        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.name === 'description').length).toBe(1);
        expect(headMeta.find(meta => meta.name === 'description').content).toBe('A test set');
      });

      it('is used as the content for the og:description meta tag', () => {
        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.property === 'og:description').length).toBe(1);
        expect(headMeta.find(meta => meta.property === 'og:description').content).toBe('A test set');
      });
    });

    describe('when the set does NOT have a description', () => {
      const testSetWithoutDescription = { id: 234, title: { en: 'My set' }, creator: { nickname: 'Tester' } };
      const wrapper = factory({ set: testSetWithoutDescription });

      it('omits the description meta tag', () => {
        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.name === 'description').length).toBe(0);
      });

      it('omits the og:description meta tag', () => {
        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.property === 'og:description').length).toBe(0);
      });
    });
  });

  describe('before leaving the page', () => {
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
});
