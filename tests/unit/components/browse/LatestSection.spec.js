import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import LatestSection from '@/components/browse/LatestSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const cards = [
  {
    identifier: 'some-identifier-one',
    name: 'a card',
    description: 'the description of the card',
    primaryImageOfPage: {
      image: {
        url: 'imageURLone.jpg',
        contentType: 'image/JPEG'
      }
    }
  },
  {
    identifier: 'some-identifier-two',
    name: 'another card',
    description: 'the description of the card',
    primaryImageOfPage: {
      image: {
        url: 'imageURLtwo.jpg',
        contentType: 'image/JPEG'
      }
    }
  },
  {
    identifier: 'some-identifier-three',
    name: 'a card without a picture',
    description: 'the description of the card'
  }
];

const factory = (propsData = { category: 'Blog posts', cards, total: 3 }) => shallowMount(LatestSection, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      thumbnail: { edmPreview: (img) => `thumbnail ${img}` }
    },
    $t: (key) => key,
    $tc: (key, count) => `${key} - ${count}`,
    localePath: (path) => path
  }
});

describe('components/browse/LatestCardSection', () => {
  it('shows a section with cards', async() => {
    const wrapper = factory();

    expect(wrapper.findAll('contentcard-stub').length).toBe(3);
  });
  it('shows a title for the category', async() => {
    const wrapper = factory();

    expect(wrapper.find('h2').text()).toBe('blog.posts - 3');
  });
  describe('when there are more than 4 cards', () => {
    it('has a more button', async() => {
      const wrapper = factory();
      await wrapper.setProps({ total: 5 });

      expect(wrapper.find('b-button-stub').exists()).toBe(true);
    });
  });
  describe('methods', () => {
    describe('galleryCardData', () => {
      it('uses the thumbnail from the edmPreview', async() => {
        const card = {
          identifier: 'some-gallery',
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
          }
        };
        const wrapper = factory();

        expect(wrapper.vm.galleryCardData(card).imageUrl).toBe('thumbnail https://api.europeana.eu/thumbnail/v2/url.json?uri=providersURI_two.jpg&type=IMAGE');
      });

      it('uses the thumbnail when no edmPreview is present', async() => {
        const card = {
          identifier: 'some-gallery',
          hasPartCollection: {
            items: [{
              encoding: {
                edmPreview: []
              },
              identifier: '/456/def',
              thumbnailUrl: 'thumbnailUrl'
            }],
            total: 12
          }
        };
        const wrapper = factory();

        expect(wrapper.vm.galleryCardData(card).imageUrl).toBe('thumbnail thumbnailUrl');
      });
    });
  });
});
