import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import StoryImageTextSlideScroller from '@/components/story/StoryImageTextSlideScroller.vue';
import sinon from 'sinon';

const localVue = createLocalVue();

const baseProps = { section: { hasPartCollection: { items: [
  { image: { image: { url: 'https://www.europeana.eu/example.jpg', height: 800, contentType: 'image/jpeg' } },
    text: 'This is text' },
  { image: { image: { url: 'https://www.europeana.eu/example.jpg', height: 800, contentType: 'image/jpeg' } },
    text: 'This is text' },
  { image: { image: { url: 'https://www.europeana.eu/example.jpg', height: 800, contentType: 'image/jpeg' } },
    text: 'This is text' }
] } } };

const quoteProps = { section: { hasPartCollection: { items: [
  { image: { image: { url: 'https://www.europeana.eu/example.jpg', height: 800, contentType: 'image/jpeg' } },
    text: 'This is a quote text', citation: 'This is attribution' }
] } } };

const factory = (propsData = baseProps) => shallowMountNuxt(StoryImageTextSlideScroller, {
  localVue,
  attachTo: document.body,
  propsData,
  stubs: ['b-card', 'b-col', 'b-row', 'b-container', 'b-img']
});

describe('components/story/StoryImageTextSlideScroller', () => {
  describe('when the page is scrolled', () => {
    it('sets transform styles on the corresponding slide image', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'appearDisappearSlideImage');

      const cardElements = wrapper.vm.$refs.slideCards;
      sinon.stub(cardElements[1], 'getBoundingClientRect').returns({ top: 100 });
      sinon.stub(cardElements[2], 'getBoundingClientRect').returns({ top: 1000 });

      window.dispatchEvent(new Event('scroll'));

      expect(wrapper.vm.$refs.slideImages[1].style.zIndex).toEqual('1');
      expect(wrapper.vm.$refs.slideImages[1].style.opacity).toEqual('1');

      expect(wrapper.vm.$refs.slideImages[2].style.zIndex).toBe('-1');
      expect(wrapper.vm.$refs.slideImages[2].style.opacity).toBe('0');
      expect(wrapper.vm.$refs.slideImages[2].style.transition).toBe('opacity 750ms, z-index 0ms 750ms');
    });
  });

  describe('beforeDestroy', () => {
    it('removes the scroll event listener', () => {
      sinon.spy(window, 'removeEventListener');
      const wrapper = factory();

      wrapper.vm.beforeDestroy();

      expect(window.removeEventListener.calledWith('scroll', wrapper.vm.appearDisappearSlideImage)).toBe(true);
    });
  });

  describe('when the slide has a citation field populated', () => {
    it('displays the quote icon, text and citation', () => {
      const wrapper = factory(quoteProps);

      expect(wrapper.find('[data-qa="slide citation icon"]').exists()).toBe(true);
      expect(wrapper.find('[data-qa="slide text"]').text()).toEqual('This is a quote text');
      expect(wrapper.find('[data-qa="slide citation"]').text()).toEqual('This is attribution');
    });
  });
});
