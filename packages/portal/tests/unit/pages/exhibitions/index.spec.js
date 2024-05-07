import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/exhibitions/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      page: 1,
      perPage: 24,
      exhibitions: [],
      total: 100
    };
  },
  mocks: {
    $t: key => key,
    $tc: key => key
  }
});

describe('Exhibitions index page', () => {
  describe('head()', () => {
    it('uses translated title', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.title).toBe('exhibitions.exhibitions', 2);
    });
  });
});
