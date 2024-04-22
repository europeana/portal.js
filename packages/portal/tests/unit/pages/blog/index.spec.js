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
      perPage: 20,
      posts: [
        {
          name: 'fake blog post',
          description: 'fake post description',
          identifier: 'fake-blog-post',
          datePublished: '2020-12-11T09:00:00.000Z',
          primaryImageOfPage: {
            image: {
              contentType: 'image/jpeg',
              url: 'imageUrl',
              description: 'Image description'
            }
          }
        }
      ],
      total: 700
    };
  },
  mocks: {
    $t: key => key,
    $route: { query: null },
    $auth: {
      loggedIn: false
    }
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
