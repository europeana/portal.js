import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import component from '@/components/user/UserLikes';

const localVue = createLocalVue();

const factory = (options = {}) => shallowMountNuxt(component, {
  localVue,
  stubs: ['b-nav', 'b-nav-item', 'client-only'],
  mocks: {
    $fetchState: options.fetchState || {},
    $likedItems: {
      fetch: sinon.stub().resolves({ items: [], partOf: { total: 0 } }),
      off: sinon.spy(),
      on: sinon.spy()
    },
    $route: { query: {} },
    $t: (key) => key
  }
});

describe('@components/user/UserLikes.vue', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('fetches the likes of the logged in user', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$likedItems.fetch.calledWith({ page: 1, pageSize: 24, profile: 'items.meta' })).toBe(true);
    });
  });
});
