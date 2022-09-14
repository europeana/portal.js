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
      it('constructs gallery links', () => {
        const wrapper = factory();

        const link = wrapper.vm.cardLink({
          __typename: 'ImageGallery',
          identifier: 'gallery'
        });

        expect(link.name).toBe('galleries-all');
      });

      it('constructs exhibition links', () => {
        const wrapper = factory();

        const link = wrapper.vm.cardLink({
          __typename: 'ExhibitionPage',
          identifier: 'exhibition'
        });

        expect(link.name).toBe('exhibitions-exhibition');
      });

      it('constructs blog post links', () => {
        const wrapper = factory();

        const link = wrapper.vm.cardLink({
          __typename: 'BlogPosting',
          identifier: 'blog'
        });

        expect(link.name).toBe('blog-all');
      });
    });

    describe('cardImage', () => {
      describe('for galleries', () => {
        const wrapper = factory();
        wrapper.vm.$apis = {
          thumbnail: {
            edmPreview: sinon.stub().returnsArg(0)
          }
        };

        it('favours edmPreview URLs', () => {
          const image = wrapper.vm.cardImage({
            __typename: 'ImageGallery',
            hasPartCollection: {
              items: [
                {
                  encoding: {
                    edmPreview: ['edmPreview.jpg']
                  }
                }
              ]
            }
          });

          expect(wrapper.vm.$apis.thumbnail.edmPreview.calledWith('edmPreview.jpg', { size: 400 })).toBe(true);
          expect(image).toBe('edmPreview.jpg');
        });

        it('falls back to thumbnailUrl URLs', () => {
          const image = wrapper.vm.cardImage({
            __typename: 'ImageGallery',
            hasPartCollection: {
              items: [
                {
                  thumbnailUrl: 'thumbnail.jpg'
                }
              ]
            }
          });

          expect(wrapper.vm.$apis.thumbnail.edmPreview.calledWith('thumbnail.jpg', { size: 400 })).toBe(true);
          expect(image).toBe('thumbnail.jpg');
        });
      });

      it('otherwise uses primaryImageOfPage URL', () => {
        const wrapper = factory();

        const image = wrapper.vm.cardImage({
          __typename: 'ExhibitionPage',
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
