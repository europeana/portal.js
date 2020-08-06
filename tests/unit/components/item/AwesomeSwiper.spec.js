import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import AwesomeSwiper from '../../../../components/item/AwesomeSwiper.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(AwesomeSwiper, {
  localVue,
  mocks: {
    $t: (key) => key,
    $proxyMedia: () => 'proxied'
  },
  propsData
});

const media = [
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
const selected = 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg';
// const nonSelected = 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg';
const id = '/2020601/https___1914_1918_europeana_eu_contributions_10265';
const europeanaIdentifier = '/2020601/https___1914_1918_europeana_eu_contributions_10265';

describe('components/item/AwesomeSwiper', () => {
  context('when the swiper loads', () => {
    it('shows a five images', () => {
      const wrapper = factory({ media, id, europeanaIdentifier });
      // console.log(wrapper.attributes());
      wrapper.findAll('img').length.should.eq(5);
    });
    it('has an identifier', () => {
      const wrapper = factory({ media, id, europeanaIdentifier });
      wrapper.attributes().id.should.eq('/2020601/https___1914_1918_europeana_eu_contributions_10265');
    });

    it('marks the selected media item', () => {
      const wrapper = factory({ media, id, europeanaIdentifier, selected });
      console.log(wrapper.attributes());
      // console.log(wrapper.find('.swiper-slide-active'));
      // const selectedImg = wrapper.find(`.swiper-slide-active img[src="${selected}"]`);

      // selectedImg.find().parent('.swiper-slide').classes().should.include('swiper-slide-active');
    });

    // describe('clicking on a non-selected thumbnail', () => {
    //   it('makes it the selected one', () => {
    //     const wrapper = factory({ media, selected, europeanaIdentifier });

    //     const nonSelectedImg = wrapper.find(`button[data-about="${nonSelected}"]`);

    //     nonSelectedImg.classes().should.not.include('selected');
    //     nonSelectedImg.trigger('click');
    //     nonSelectedImg.classes().should.include('selected');
    //   });

    //   it('emits a `select` event with the item URI', () => {
    //     const wrapper = factory({ media, selected });

    //     const nonSelectedImg = wrapper.find(`button[data-about="${nonSelected}"]`);
    //     nonSelectedImg.trigger('click');

    //     wrapper.emitted('select').should.deep.eq([[nonSelected]]);
    //   });
    // });
  });
});
