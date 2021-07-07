import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '../../../src/pages/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const heroImageUrl = 'http://example.org/contentful/asset.jpg';
const socialMediaImageUrl = 'https://example.org/social-media-image.jpg';

const factory = (socialMediaImage = null, primaryImageOfPage = null) => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      browsePage: true,
      identifer: 'home',
      name: 'Welcome to Europeana',
      primaryImageOfPage,
      image: socialMediaImage,
      hasPartCollection: {
        items: []
      }
    };
  },
  mocks: {
    $t: key => key,
    $pageHeadTitle: key => key,
    $config: { app: { features: {} } }
  }
});

describe('Browse/Home page', () => {
  describe('head()', () => {
    it('uses the social media image for og:image', () => {
      const wrapper = factory({
        url: socialMediaImageUrl,
        contentType: 'image/jpeg',
        description: 'Social media image description'
      });

      const headMeta = wrapper.vm.head().meta;

      headMeta.filter(meta => meta.property === 'og:image').length.should.eq(1);
      headMeta.find(meta => meta.property === 'og:image').content.should.eq(socialMediaImageUrl);
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
      const wrapper = factory(null, primaryImageOfPage);

      const headMeta = wrapper.vm.head().meta;

      headMeta.filter(meta => meta.property === 'og:image').length.should.eq(1);
      headMeta.find(meta => meta.property === 'og:image').content.should.eq(heroImageUrl);
    });

    it('does not set og image info when no relevant images exist', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      headMeta.filter(meta => meta.property === 'og:image').length.should.eq(0);
    });
  });
});
