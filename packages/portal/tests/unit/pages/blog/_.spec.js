import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/blog/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const heroImageUrl = 'http://example.org/contentful/asset.jpg';

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      post: {
        name: 'fake blog post',
        identifier: 'fake-blog-post',
        datePublished: '2020-12-11T09:00:00.000Z',
        primaryImageOfPage: {
          image: {
            url: heroImageUrl,
            description: 'Image description'
          }
        },
        authorCollection: {
          items: []
        }
      }
    };
  },
  mocks: {
    $features: {},
    $store: {
      commit: sinon.spy()
    },
    $t: key => key,
    $auth: {
      loggedIn: false
    }
  }
});

describe('Blog post page', () => {
  describe('fetch', () => {
    it('stores pageMeta', () => {
      const wrapper = factory();

      wrapper.vm.fetch();

      expect(wrapper.vm.$store.commit.calledWith('pageMeta/set', sinon.match.object)).toBe(true);
    });
  });

  describe('pageMeta()', () => {
    it('uses hero image for og:image', () => {
      const wrapper = factory();

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(heroImageUrl);
    });
  });
});
