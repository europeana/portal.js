import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/galleries/index';

const localVue = createLocalVue();
localVue.directive('masonry', {});
localVue.directive('masonry-tile', {});
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      total: 2,
      galleries: [
        {
          description: 'A fake gallery One',
          hasPartCollection: {
            items: [{
              encoding: {
                edmPreview: [
                  'https://api.europeana.eu/thumbnail/v2/url.json?uri=providersURI.jpg&type=IMAGE'
                ]
              },
              identifier: '/123/abc',
              thumbnailUrl: null
            }],
            total: 12
          },
          identifier: 'fake-gallery-one',
          name: 'Fake gallery One'
        },
        {
          description: 'A fake gallery Two',
          hasPartCollection: {
            items: [{
              encoding: {
                edmPreview: [
                  'https://api.europeana.eu/thumbnail/v2/url.json?uri=providersURI_two.jpg&type=IMAGE'
                ]
              },
              identifier: '/456/def',
              thumbnailUrl: null
            }],
            total: 12
          },
          identifier: 'fake-gallery-two',
          name: 'Fake gallery Two'
        }
      ],
      page: 1,
      perPage: 20
    };
  },
  mocks: {
    $apis: {
      thumbnail: { edmPreview: (img) => `thumbnail ${img}` }
    },
    $pageHeadTitle: key => key,
    $t: key => key,
    $tc: key => key,
    $i18n: {
      locale: () => 'en'
    },
    $auth: {
      loggedIn: false
    },
    asyncData: () => true
  }
});

describe('Gallery index page', () => {
  describe('head()', () => {
    it('sets the page title as galleries.galleries(from locale file)', () => {
      const wrapper = factory();

      const headTitle = wrapper.vm.head().title;

      expect(headTitle).toEqual('galleries.galleries');
    });
  });

  describe('Content Cards', () => {
    it('has as many cards as there are galleries', () => {
      const wrapper = factory();

      const cards = wrapper.findAllComponents('contentcard-stub');
      expect(cards).toHaveLength(2);
    });
  });

  describe('methods', () => {
    describe('imageUrl', () => {
      describe('when a gallery has an edmPreview value', () => {
        it('uses the previewUrl', () => {
          const wrapper = factory();

          const imageUrl = wrapper.vm.imageUrl({ encoding: { edmPreview: ['edmPreviewURI'] } });
          expect(imageUrl).toEqual('thumbnail edmPreviewURI');
        });
      });
      describe('when a gallery has No edmPreview value, but a thubmnailUrl', () => {
        it('uses the thumbnailUrl', () => {
          const wrapper = factory();

          const imageUrl = wrapper.vm.imageUrl({ encoding: { edmPreview: [] }, thumbnailUrl: 'thumbnailUrl' });
          expect(imageUrl).toEqual('thumbnail thumbnailUrl');
        });
      });
    });
  });
});
