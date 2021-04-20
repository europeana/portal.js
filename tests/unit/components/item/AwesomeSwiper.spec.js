import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import AwesomeSwiper from '../../../../src/components/item/AwesomeSwiper.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(AwesomeSwiper, {
  localVue,
  mocks: {
    $t: (key) => key,
    $apis: {
      record: {
        mediaProxyUrl: () => 'proxied'
      }
    }
  },
  propsData
});

const displayableMedia = [
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
];

const europeanaIdentifier = '/2020601/https___1914_1918_europeana_eu_contributions_10265';

describe('components/item/AwesomeSwiper', () => {
  context('when the swiper loads', () => {
    it('shows five slides', () => {
      const wrapper = factory({ displayableMedia, europeanaIdentifier });
      wrapper.findAll('div.swiper-slide').length.should.eq(5);
    });

    it('emits a `select` event with the item identifier', () => {
      const wrapper = factory({ europeanaIdentifier, displayableMedia });

      wrapper.vm.swiper.slideTo(1, 1000, false);
      wrapper.emitted('select').should.deep.eq([[displayableMedia[1].about]]);
    });
  });
  describe('singleMediaResource', () => {
    it('is false when there are multiple displayableMedia', () => {
      const wrapper = factory({ displayableMedia, europeanaIdentifier });

      wrapper.vm.singleMediaResource.should.eq(false);
    });
    it('is NOT enabled when there is one displayableMedia resource', () => {
      const wrapper = factory({ displayableMedia: [displayableMedia[0]], europeanaIdentifier });

      wrapper.vm.singleMediaResource.should.eq(true);
    });
  });
});
