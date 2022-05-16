import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaCardImage from '@/components/item/MediaCardImage.vue';

const localVue = createLocalVue();
const factory = () => shallowMount(MediaCardImage, {
  localVue,
  stubs: ['b-img-lazy', 'b-link', 'b-img'],
  propsData: {
    media: {
      about: 'http://collections.rmg.co.uk/mediaLib/422/media-422123/large.jpg',
      thumbnails: {
        large: 'https://api.europeana.eu/thumbnail/v3/400/83ef43b6ede8c8b98c7b90b64b717234'
      }
    },
    lazy: false,
    europeanaIdentifier: '/123/abcdef'
  },
  mocks: {
    $t: (key) => key,
    $apis: {
      record: {
        mediaProxyUrl: () => 'proxied'
      }
    }
  }
});

describe('components/item/MediaCardImage', () => {
  it('has a link', () => {
    const wrapper = factory();
    const link = wrapper.find('[data-qa="media link"]');

    expect(link.exists()).toBe(true);
  });

  it('has a preview image', () => {
    const wrapper = factory();
    const image = wrapper.find('[data-qa="media preview image"]');

    expect(image.exists()).toBe(true);
  });

  describe('methods', () => {
    describe('imageNotFound', () => {
      it('shows the default thumbnail', async() => {
        const wrapper = factory();
        await wrapper.vm.imageNotFound();

        expect(wrapper.vm.showDefaultThumbnail).toBe(true);
      });
    });
  });
});
