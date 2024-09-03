import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import WebResource from '@/plugins/europeana/edm/WebResource.js';

import ItemMediaSwiperThumbnail from '@/components/item/ItemMediaSwiperThumbnail';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const testPropsData = {
  media: new WebResource({
    about: 'http://collections.rmg.co.uk/mediaLib/422/media-422123/large.jpg'
  })
};

const factory = (propsData = testPropsData) => shallowMount(ItemMediaSwiperThumbnail, {
  localVue,
  propsData,
  mocks: {
    $nuxt: {
      context: {
        $apis: {
          thumbnail: {
            media: () => 'https://api.europeana.eu/thumbnail/v3/400/83ef43b6ede8c8b98c7b90b64b717234'
          }
        }
      }
    }
  }
});

describe('components/item/ItemMediaSwiperThumbnail', () => {
  describe('on thumbnail button click', () => {
    it('emits the click event', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="swiper slide thumbnail"]').trigger('click');

      expect(wrapper.emitted('click').length).toBe(1);
    });
  });
});

