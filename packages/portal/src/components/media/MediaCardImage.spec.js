import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaCardImage from '@/components/media/MediaCardImage.vue';
import EuropeanaMediaResource from '@/utils/europeana/media/Resource.js';

const localVue = createLocalVue();
const factory = ({ propsData } = {}) => shallowMount(MediaCardImage, {
  localVue,
  stubs: ['b-img-lazy', 'b-link', 'b-img'],
  propsData: {
    resource: new EuropeanaMediaResource({
      id: 'http://collections.rmg.co.uk/mediaLib/422/media-422123/large.jpg'
    }),
    lazy: false,
    europeanaIdentifier: '/123/abcdef',
    ...propsData
  },
  mocks: {
    $t: (key) => key,
    $apis: {
      thumbnail: {
        forWebResource: () => ({
          large: 'https://api.europeana.eu/thumbnail/v3/400/83ef43b6ede8c8b98c7b90b64b717234',
          small: 'https://api.europeana.eu/thumbnail/v3/200/83ef43b6ede8c8b98c7b90b64b717234'
        })
      },
      record: {
        mediaProxyUrl: () => 'proxied'
      }
    }
  }
});

describe('components/media/MediaCardImage', () => {
  it('has a link', () => {
    const wrapper = factory();

    const link = wrapper.find('b-link-stub');

    expect(link.exists()).toBe(true);
  });

  it('has a preview image', () => {
    const wrapper = factory();

    const image = wrapper.find('b-img-stub');

    expect(image.exists()).toBe(true);
  });

  describe('when the resource has a IIIF Image API service', () => {
    const resource = new EuropeanaMediaResource({
      id: 'https://iiif.example.org/image/0001/full/full/0/default.jpg',
      service: {
        id: 'https://iiif.example.org/image/0001',
        profile: 'http://iiif.io/api/image/2/level1.json',
        type: 'ImageService3'
      }
    });

    it('uses the service for the thumbnail', () => {
      const wrapper = factory({ propsData: { resource } });

      const image = wrapper.find('b-img-stub');

      expect(image.attributes('src')).toBe('https://iiif.example.org/image/0001/full/400,/0/default.jpg');
    });
  });

  describe('when the resource has no IIIF Image API service', () => {
    it('uses the Europeana Thumbnail API for the thumbnail', () => {
      const wrapper = factory();

      const image = wrapper.find('b-img-stub');

      expect(image.attributes('src')).toBe('https://api.europeana.eu/thumbnail/v3/400/83ef43b6ede8c8b98c7b90b64b717234');
    });
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
