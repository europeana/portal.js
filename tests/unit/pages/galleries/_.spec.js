import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/galleries/_';

const localVue = createLocalVue();
localVue.directive('masonry', {});
localVue.directive('masonry-tile', {});
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      contentWarning: {
        name: 'Warning title',
        description: 'Warning description'
      },
      identifier: 'fake-gallery',
      images: [
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
      ],
      rawDescription: 'Fake gallery description',
      title: 'Fake gallery title'
    };
  },
  mocks: {
    $apis: {
        thumbnail: { edmPreview: (img) => img?.edmPreview?.[0] }
    },
    $features: {},
    $pageHeadTitle: key => key,
    $t: key => key,
    $tc: key => key,
    $path: () => '/',
    $i18n: {
      locale: () => 'en'
    },
    $$redrawVueMasonry: () => true,
    $auth: {
      loggedIn: false
    },
    asyncData: () => true
  }
});

describe('Gallery post page', () => {
  describe('head()', () => {
    it('uses the first image for og:image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe('https://api.europeana.eu/thumbnail/v2/url.json?uri=https://example.org/image&type=IMAGE');
    });
  });

  describe('Content warning modal', () => {
    it('is present with the galleries identifier set', () => {
      const wrapper = factory();
      const warningModal = wrapper.find('#content-warning-modal');
      expect(warningModal.exists()).toBe(true);
    });
  });

  describe('Content Cards', () => {
    it('has as many cards as there are images', () => {
      const wrapper = factory();
      const cards = wrapper.findAllComponents('[data-qa="content card"]');
      expect(cards).toHaveLength(2);
    });
  });
});
