import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/blog/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      page: 1,
      perPage: 24,
      posts: [],
      total: 100
    };
  },
  mocks: {
    $t: key => key
  }
});

describe('Blog post index page', () => {
  describe('head()', () => {
    it('uses translated title', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.title).toBe('blog.blog');
    });
  });
});
