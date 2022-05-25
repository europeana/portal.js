import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import HomeLatest from '@/components/home/HomeLatest.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulQueryResponse = {
  data: {
    data: {
      blogPostingCollection: {
        items: [
          { identifier: 'blog-1' }
        ]
      },
      exhibitionPageCollection: {
        items: [
          { identifier: 'exhibition-1' }
        ]
      },
      imageGalleryCollection: {
        items: [
          { identifier: 'gallery-1' }
        ]
      }
    }
  }
};

const factory = () => shallowMountNuxt(HomeLatest, {
  localVue,
  stubs: ['b-card-group'],
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(contentfulQueryResponse)
    },
    $i18n: {
      isoLocale: () => 'en-GB'
    },
    $route: {
      query: {}
    },
    $t: (key) => key
  }
});

describe('components/home/HomeLatest', () => {
  describe('fetch', () => {
    it('shows a section with editorial content', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      const section =  wrapper.find('[data-qa="latest editorial"]');
      expect(section.exists()).toBe(true);
    });

    it('shows 3 cards', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      const section =  wrapper.find('[data-qa="latest editorial"]');
      expect(section.findAll('contentcard-stub').length).toBe(3);
    });
  });

  describe('methods', () => {
    describe('cardLink', () => {
      it('returns a link', async() => {
        const wrapper = factory();
        const link = wrapper.vm.cardLink({
          __typename: 'ImageGallery',
          name: 'Female literacy in the Middle Ages',
          identifier: 'female-literacy-in-the-middle-ages',
          description: 'Female literacy during the Middle Ages'
        });

        expect(link.name).toBe('galleries-all');
      });
    });

    describe('cardImage', () => {
      it('returns an image', async() => {
        const wrapper = factory();
        const image = wrapper.vm.cardImage({
          __typename: 'ExhibitionPage',
          name: 'Black lives in Europe',
          identifier: 'black-lives-in-europe',
          primaryImageOfPage: {
            image: {
              url: 'image.jpg'
            }
          }
        });

        expect(image).toBe('image.jpg');
      });
    });
  });
});
