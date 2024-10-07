import { createLocalVue, shallowMount } from '@vue/test-utils';
import MediaCardImage from '@/components/media/MediaCardImage.vue';
import WebResource from '@/plugins/europeana/edm/WebResource.js';

const localVue = createLocalVue();
const factory = () => shallowMount(MediaCardImage, {
  localVue,
  stubs: ['b-img-lazy', 'b-link', 'b-img'],
  propsData: {
    media: new WebResource({
      about: 'http://collections.rmg.co.uk/mediaLib/422/media-422123/large.jpg'
    }),
    lazy: false,
    europeanaIdentifier: '/123/abcdef'
  },
  mocks: {
    $nuxt: {
      context: {
        $apis: {
          thumbnail: {
            media: () => 'https://api.europeana.eu/thumbnail/v3/400/83ef43b6ede8c8b98c7b90b64b717234'
          }
        }
      }
    },
    $t: (key) => key,
    $apis: {
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
