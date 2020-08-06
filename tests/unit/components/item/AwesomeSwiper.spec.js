import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import AwesomeSwiper from '../../../../components/item/AwesomeSwiper.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  media: [
    {
      about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg',
      thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg' },
      rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
    },
    {
      about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
      thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' },
      rightsStatement: 'https://creativecommons.org/licenses/by-nd/4.0/'
    },
    {
      about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
      thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119203%2F10265.119203.original.jpg' },
      rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
    },
    {
      about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
      thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119639%2F10265.119639.original.jpg' },
      rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
    },
    {
      about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
      thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg' },
      rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
    }
  ],
  id: '/2020601/https___1914_1918_europeana_eu_contributions_10265'
};

const factory = () => mount(AwesomeSwiper, {
  localVue,
  mocks: {
    $t: (key) => key,
    $proxyMedia: () => 'proxied'
  },
  propsData
});

describe('components/item/AwesomeSwiper', () => {
  describe('when the slide changes', () => {
    it('shows a new image', () => {
      const wrapper = factory();

      // wrapper.attributes().href.should.eq('proxied');
      wrapper.findAll('img').length.should.eq(1);
    });
  });

});
