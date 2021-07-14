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
    $config: { app: { features: {} } },
    $pageHeadTitle: key => key,
    $t: key => key,
    $auth: {
      loggedIn: false
    }
  }
});

describe('Blog post page', () => {
  describe('head()', () => {
    it('uses hero image for og:image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      headMeta.filter(meta => meta.property === 'og:image').length.should.eq(1);
      headMeta.find(meta => meta.property === 'og:image').content.should.eq(heroImageUrl);
    });
  });
});
