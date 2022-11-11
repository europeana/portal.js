import exhibitionChapters from '@/mixins/exhibitionChapters';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/exhibitions/_exhibition/_chapter';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const heroImageExample =           { image: {
  url: 'http://example.org/contentful/asset.jpg',
  description: 'Hero image description'
} };

const factory = (heroImage) => shallowMountNuxt(page, {
  localVue,
  mixins: [
    exhibitionChapters
  ],
  data() {
    return {
      chapters: [],
      exhibitionIdentifier: 'exhibition',
      exhibitionTitle: 'exhibition name',
      exhibitionContentWarning: null,
      relatedLink: null,
      page: {
        name: '',
        headline: '',
        description: '',
        text: '',
        primaryImageOfPage: heroImage,
        hasPartCollection: {
          items: []
        }
      }
    };
  },
  mocks: {
    $contentful: {
      assets: {
        optimisedSrc: (img) => `${img?.url}?optimised`
      }
    },
    $t: key => key,
    $tc: () => {},
    $pageHeadTitle: key => key
  }
});

describe('pages/exhibitions/_exhibition/_chapter', () => {
  describe('head()', () => {
    it('uses optimised hero image for og:image', () => {
      const wrapper = factory(heroImageExample);

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.ogImage).toBe(`${heroImageExample.image.url}?optimised`);
    });

    it('does not set og:image when no hero image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.ogImage).toBe(null);
    });
  });
});
