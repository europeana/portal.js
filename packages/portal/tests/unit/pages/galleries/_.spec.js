import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/galleries/_';

const localVue = createLocalVue();
localVue.directive('masonry', {});
localVue.directive('masonry-tile', {});
localVue.use(BootstrapVue);

const contentfulGalleryMock = { data: { data: {
  imageGalleryCollection: {
    items: [{
      contentWarning: {
        name: 'Warning title',
        description: 'Warning description'
      },
      identifier: 'fake-gallery',
      name: 'Fake gallery title',
      description: 'Fake gallery description',
      hasPartCollection: { items: [
        {
          identifier: '/123/ABC',
          encoding: {
            dataProvider: ['Fake provider 1'],
            dcCreator: ['https://www.wikidata.org/entity/123', 'Creator Label'],
            dcCreatorLangAware: {
              def: ['https://www.wikidata.org/entity/123'],
              en: ['Creator Label']
            },
            dcDescription: ['Fake description'],
            dcDescriptionLangAware: {
              en: ['Fake lang aware description']
            },
            dcTitleLangAware: {
              en: ['Fake lang aware title']
            },
            edmIsShownAt: ['https://example.org/image'],
            edmPlaceLatitude: ['40.0', '41.82046'],
            edmPlaceLongitude: ['-4.0', '1.86768'],
            edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=https://example.org/image&type=IMAGE'],
            europeanaCompleteness: 0,
            guid: 'https://www.europeana.eu/item/123/ABC',
            id: '/123/ABC',
            link: 'https://api.europeana.eu/record/123/ABC',
            provider: ['Fake Provider'],
            rights: ['http://creativecommons.org/licenses/by-nc-nd/4.0/'],
            score: 16.525795,
            title: ['Fake Title'],
            type: 'IMAGE'
          },
          thumbnailUrl: null,
          name: 'fake Title'
        },
        {
          identifier: '/123/XYZ',
          encoding: {
            dataProvider: ['Fake provider 1'],
            dcCreator: ['https://www.wikidata.org/entity/123', 'Creator Label'],
            dcCreatorLangAware: {
              def: ['https://www.wikidata.org/entity/123'],
              en: ['Creator Label']
            },
            dcDescription: ['Fake description two'],
            dcDescriptionLangAware: {
              en: ['Fake lang aware description two']
            },
            dcTitleLangAware: {
              en: ['Fake lang aware title two']
            },
            edmIsShownAt: ['https://example.org/image'],
            edmPlaceLatitude: ['40.0', '41.82046'],
            edmPlaceLongitude: ['-4.0', '1.86768'],
            edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=https://example.org/image&type=IMAGE'],
            europeanaCompleteness: 0,
            guid: 'https://www.europeana.eu/item/123/XYZ',
            id: '/123/XYZ',
            link: 'https://api.europeana.eu/record/123/XYZ',
            provider: ['Fake Provider'],
            rights: ['http://creativecommons.org/licenses/by-nc-nd/4.0/'],
            score: 16.525795,
            title: ['Fake Title two'],
            type: 'IMAGE'
          },
          thumbnailUrl: null,
          name: 'fake Title two'
        }

      ] }
    }]
  }
} } };

const contentfulQueryStub = sinon.stub().resolves(contentfulGalleryMock);

const factory = (contentfulQuery = contentfulQueryStub) => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $apis: {
      thumbnail: { edmPreview: (img) => img }
    },
    $auth: {
      loggedIn: false
    },
    $contentful: {
      assets: {
        isValidUrl: (url) => url.includes('images.ctfassets.net'),
        optimisedSrc: (img) => `${img.url}?optimised`
      },
      query: contentfulQuery
    },
    $features: {},
    $t: key => key,
    $tc: key => key,
    $path: () => '/',
    $fetchState: {},
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $nuxt: { context: { res: {} } },
    $pageHeadTitle: key => key,
    $$redrawVueMasonry: () => true,
    $route: { query: '', params: { pathMatch: 'fake-gallery' } }
  }
});

describe('Gallery post page', () => {
  describe('pageMeta', () => {
    it('uses the first image for og:image', async() => {
      const wrapper = factory();

      await wrapper.vm.$fetch();

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https://example.org/image&type=IMAGE');
    });
  });

  describe('Content warning modal', () => {
    it('is present with the galleries identifier set', async() => {
      const wrapper = factory();

      await wrapper.vm.$fetch();

      const warningModal = wrapper.find('#content-warning-modal');
      expect(warningModal.exists()).toBe(true);
    });
  });

  describe('Content Cards', () => {
    it('has as many cards as there are images', async() => {
      const wrapper = factory();

      await wrapper.vm.$fetch();

      const cards = wrapper.findAllComponents('[data-qa="content card"]');
      expect(cards).toHaveLength(2);
    });
  });
});
