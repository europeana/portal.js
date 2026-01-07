import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import { reactive } from 'vue';
import * as vue2RouterHelpers from 'vue2-helpers/vue-router';

import page from '@/pages/account/index';
import * as selectedItemsComposable from '@/composables/selectedItems.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const clearSelectedItemsSpy = sinon.spy();

const factory = (options = {}) => {
  sinon.stub(vue2RouterHelpers, 'useRoute').returns(reactive({ hash: options.hash || '' }));

  return shallowMountNuxt(page, {
    localVue,
    stubs: ['b-nav', 'b-nav-item', 'client-only'],
    mocks: {
      $t: key => key,
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
      localePath: (path) => path
    }
  });
};

describe('pages/account/index.vue', () => {
  beforeAll(() => {
    sinon.stub(selectedItemsComposable, 'useSelectedItems')
      .returns({
        clear: clearSelectedItemsSpy
      });
  });
  afterEach(() => {
    sinon.resetHistory();
    vue2RouterHelpers.useRoute.restore?.();
  });
  afterAll(sinon.restore);

  it('sets the page meta title to the localised account title key', () => {
    const wrapper = factory();

    expect(wrapper.vm.pageMeta.title).toBe('account.title');
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
});
