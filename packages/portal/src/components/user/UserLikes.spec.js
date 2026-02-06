import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import component from '@/components/user/UserLikes';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const likesId = '123';
const setApiGetStub = sinon.stub().resolves({ items: [], partOf: { total: 0 } });
const storeCommit = sinon.spy();

const factory = (options = {}) => shallowMountNuxt(component, {
  localVue,
  stubs: ['b-nav', 'b-nav-item', 'client-only'],
  mocks: {
    $apis: {
      set: {
        get: setApiGetStub
      }
    },
    $fetchState: options.fetchState || {},
    $likedItems: {
      off: sinon.spy(),
      on: sinon.spy()
    },
    $route: { query: {} },
    $store: {
      commit: storeCommit,
      state: {
        set: {
          likesId
        }
      }
    },
    $t: key => key
  }
});

describe('@components/user/UserLikes.vue', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('fetches the likes of the logged in user', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(setApiGetStub.calledWith(likesId, { page: 1, pageSize: 24, profile: 'items.meta' })).toBe(true);
    });
  });
});
