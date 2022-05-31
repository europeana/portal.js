import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const swiperSlides = [{
  title: 'World War I',
  description: 'Collection of untold stories and official histories of World War I, in a unique blend of cultural heritage collections and personal items contributed by European citizens.',
  url: '/en/collections/topic/83-world-war-i'
},
{
  title: 'Archaeology',
  description: 'Explore all facets of archaeology from European museums, galleries, libraries and archives.',
  url: '/en/collections/topic/80-archaeology'
},
{
  title: 'Art',
  description: 'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.',
  url: '/en/collections/topic/190-art'
}];

const factory = () => mount(StackedCardsSwiper, {
  localVue,
  propsData: {
    slides: swiperSlides
  },
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/StackedCardsSwiper', () => {
  describe('when the swiper loads', () => {
    it('shows three slides', () => {
      const wrapper = factory();

      expect(wrapper.findAll('div.swiper-slide').length).toBe(3);
    });
  });
});
