import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/exhibitions/_exhibition/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const description = 'this describes the exhibition';
const primaryImageOfPage = {
  url: 'http://example.org/contentful/asset.jpg',
  image: {
    url: 'http://example.org/contentful/asset.jpg',
    description: ''
  }
};

const defaultOptions = {
  description,
  primaryImageOfPage
};

const factory = (options = defaultOptions) => shallowMountNuxt(page, {
  localVue,
  provide: {
    canonicalUrl: {}
  },
  data() {
    return {
      identifier: 'exhibition',
      name: '',
      headline: '',
      description: options.description,
      text: '',
      primaryImageOfPage: options.primaryImageOfPage,
      hasPartCollection: {
        items: [
          {
            name: 'exhibition part 1',
            identifier: 'exhibition-part-1',
            primaryImageOfPage: {
              image: {
                url: 'https://www.example.eu/image1.jpg',
                description: 'Chapter image description'
              }
            }
          }
        ]
      },
      credits: '',
      contentWarning: null,
      relatedLink: [
        'http://data.europeana.eu/concept/194',
        'http://data.europeana.eu/concept/21'
      ],
      categoriesCollection: options.tags || null,
      genre: null,
      datePublished: '2020-01-01'
    };
  },
  mocks: {
    $d: date => date,
    $features: {},
    $i18n: { localeProperties: { iso: {} } },
    $t: key => key,
    $tc: () => {},
    localePath: () => '/',
    $store: {
      commit: sinon.spy()
    },
    $route: {}
  },
  stubs: [
    'AuthoredHead',
    'ContentWarningModal',
    'EntityBadges',
    'LinkList',
    'RelatedCategoryTags',
    'ThemeBadges'
  ]
});

describe('Exhibition landing page', () => {
  describe('head()', () => {
    it('uses optimised hero image for og:image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.ogImage).toBe(primaryImageOfPage.image);
    });
    it('uses optimised hero image description for og:image:alt', () => {
      primaryImageOfPage.image.description = 'alt description for hero image';
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.ogImageAlt).toBe(primaryImageOfPage.image.description);
    });
    it('uses description for og:description', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.description).toBe(description);
    });
    it('does not populate metatags when no data available', () => {
      const wrapper = factory({});

      const headMeta = wrapper.vm.pageMeta;

      expect(headMeta.description).toBeUndefined();
      expect(headMeta.ogImage).toBe(null);
    });
  });

  describe('related category tags', () => {
    it('are rendered when there are any', () => {
      const wrapper = factory({ tags: { items: [{ name: 'surrealism' }] } });

      const RelatedCategoryTags = wrapper.find('[data-qa="related category tags"]');

      expect(RelatedCategoryTags.exists()).toBe(true);
    });
    it('are not loaded when there are none', () => {
      const wrapper = factory();

      const RelatedCategoryTags = wrapper.find('[data-qa="related category tags"]');

      expect(RelatedCategoryTags.exists()).toBe(false);
    });
  });
});
