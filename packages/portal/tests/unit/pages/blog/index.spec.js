import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

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
    $store: {
      commit: sinon.spy()
    },
    $t: key => key,
    $route: { query: null },
    $auth: {
      loggedIn: false
    }
  }
});

describe('Blog post index page', () => {
  describe('pagination', () => {
    it('has a pagination nav', () => {
      const wrapper = factory();

      const pagination = wrapper.find('paginationnavinput-stub');
      expect(pagination.exists()).toBe(true);
    });
  });
});
