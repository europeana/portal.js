import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/stories/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const heroImageUrl = 'http://example.org/contentful/asset.jpg';

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      post: {
        name: 'fake story',
        identifier: 'fake-story',
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
      fullPath: '/en/stories/fake-story',
      path: '/en/stories/fake-story'
    },
    $i18n: {
      locale: 'en'
    },
    $config: {
      app: {
        baseUrl: 'https://www.europeana.eu'
      }
    },
    $fetchState: {
      pending: false,
      error: null
    }
  }
});

describe('Story page', () => {
  describe('pageMeta()', () => {
    it('uses hero image for og:image', () => {
      const wrapper = factory();

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(heroImageUrl);
    });
  });
});
