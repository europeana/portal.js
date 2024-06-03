import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const swiperSlides = [{
  title: 'World War I',
  description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.',
  url: '/en/collections/topic/83-world-war-i',
  image: { url: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214' }
},
{
  title: 'Archaeology',
  description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
  url: '/en/collections/topic/80-archaeology',
  image: { url: 'https://images.ctfassets.net/i01duvb6kq77/6g2HPP0JVfFh29Vx5nHPhO/fc1c1f817ef32fc9639013487759b45b/_15512_o_59888' }
},
{
  title: 'Art',
  description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.',
  url: '/en/collections/topic/190-art'
}];

const factory = (options = {}) => mount(StackedCardsSwiper, {
  localVue,
  attachTo: document.body,
  propsData: {
    slides: swiperSlides,
    title: options.title
  },
  mocks: {
    $contentful: {
      assets: {
        isContentfulAssetUrl: (url) => url.includes('images.ctfassets.net'),
        optimisedContentfulImageUrl: sinon.spy((img) => `${img.url}?optimised`),
        responsiveContentfulImageSrcset: sinon.spy((img, sizes) => Object.keys(sizes))
      }
    },
    $t: () => {}
  }
});

describe('components/generic/StackedCardsSwiper', () => {
  afterEach(sinon.resetHistory);

  describe('when the swiper loads', () => {
    it('shows three slides', () => {
      const wrapper = factory();

      expect(wrapper.findAll('div.swiper-slide').length).toBe(3);
    });
  });
  describe('When a title is present', () => {
    it('renders a heading', () => {
      const wrapper = factory({ title: 'Slider' });

      expect(wrapper.find('h2').text()).toEqual('Slider');
    });
  });
  describe('When active slide changes', () => {
    it('focus is set on the active\'s slide link', () => {
      const wrapper = factory();

      wrapper.vm.swiper.activeIndex = 1;
      wrapper.vm.setFocusOnActiveSlideLink();

      const slideLink = wrapper.find(`[data-qa="slide link ${wrapper.vm.swiper.activeIndex}"]:focus`);

      expect(slideLink.exists()).toBe(true);
    });
  });
});
