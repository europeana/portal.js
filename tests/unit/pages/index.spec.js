import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const heroImageUrl = 'http://example.org/contentful/asset.jpg';
const socialMediaImageUrl = 'https://example.org/social-media-image.jpg';

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      browsePage: true,
      page: {
        identifer: 'home',
        name: 'Welcome to Europeana',
        primaryImageOfPage: options.primaryImageOfPage || null,
        image: options.socialMediaImage || null,
        hasPartCollection: {
          items: []
        }
      }
    };
  },
  mocks: {
    $fetchState: {},
    $t: key => key,
    $pageHeadTitle: key => key,
    $features: options.features || {},
    $route: { params: options.routeParams || {} }
  }
});

describe('IndexPage', () => {
  describe('head()', () => {
    it('uses the social media image for og:image', () => {
      const wrapper = factory({ socialMediaImage: {
        url: socialMediaImageUrl,
        contentType: 'image/jpeg',
        description: 'Social media image description'
      } });

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(socialMediaImageUrl);
    });

    it('uses hero image for og:image when no social media image is set', () => {
      const primaryImageOfPage = {
        image: {
          image: {
            url: heroImageUrl,
            description: 'Hero image description'
          }
        },
        link: {
          text: 'Go',
          url: 'https://example.org/explore'
        }
      };
      const wrapper = factory({ primaryImageOfPage });

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(heroImageUrl);
    });

    it('does not set og image info when no relevant images exist', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(0);
    });
  });
});
