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
    $t: key => key,
    $tc: () => {},
    $pageHeadTitle: key => key
  }
});

describe('Exhibition Chapter page', () => {
  describe('head()', () => {
    it('uses hero image for og:image', () => {
      const wrapper = factory(heroImageExample);

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(heroImageExample.image.url);
    });
    it('does not set og:image when no hero image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(0);
    });
  });
});
