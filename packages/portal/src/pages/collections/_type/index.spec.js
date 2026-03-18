import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import collectionType from '@/pages/collections/_type/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(collectionType, {
  localVue,
  mocks: {
    $fetchState: options.fetchState || {},
    $t: (key, args) => args ? `${key} ${args}` : key,
    $route: { params: { type: options.type } },
    $pageHeadTitle: key => key,
    $error: sinon.spy()
  },
  stubs: ['EntityTable', 'ErrorMessage']
});

describe('pages/collections/_type/index', () => {
  describe('fetch', () => {
    it('detects no valid collection type and calls $error with 404', async() => {
      const wrapper = factory({ type: 'not-found' });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$error.calledWith(404)).toBe(true);
    });
  });

  describe('computed', () => {
    describe('pageTitle', () => {
      it('is based on the route', () => {
        const wrapper = factory({ type: 'topics' });

        const title = wrapper.vm.pageTitle;

        expect(title).toEqual('pages.collections.topics.title');
      });
    });
  });
});
