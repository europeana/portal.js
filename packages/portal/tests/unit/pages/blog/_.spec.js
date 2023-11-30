import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

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
    $t: key => key,
    $auth: {
      loggedIn: false
    },
    $route: {
      fullPath: 'https://www.europeana.eu/en/blog/fake-blog-post',
      path: '/en/blog/fake-blog-post'
    },
    $i18n: {
      locale: 'en'
    },
    $config: {
      app: {
        baseUrl: 'https://www.europeana.eu'
      }
    }
  }
});

describe('Blog post page', () => {
  describe('pageMeta()', () => {
    it('uses hero image for og:image', () => {
      const wrapper = factory();

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(heroImageUrl);
    });
  });
});
