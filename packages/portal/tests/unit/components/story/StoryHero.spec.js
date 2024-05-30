import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import StoryHero from '@/components/story/StoryHero.vue';
import sinon from 'sinon';

const localVue = createLocalVue();

const baseProps = { title: 'This is a title',
  hero: { image: { url: 'https://www.europeana.eu/example.jpg', height: 800, contentType: 'image/jpeg' } } };

const factory = (propsData = baseProps) => mountNuxt(StoryHero, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveImageSrcset: sinon.spy((img) => `${img.url}?optimised`),
        isValidUrl: () => true,
        optimisedSrc: (img) => img?.url
      }
    },
    $t: () => {}
  },
  stubs: ['b-button', 'b-container', 'b-col', 'b-img']
});

describe('components/story/StoryHero', () => {
  describe('when the page is scrolled', () => {
    it('sets transform styles on the background', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'parallaxBackground');
      window.dispatchEvent(new Event('scroll'));

      expect(document.querySelector('#hero-background-image img').style.transform).toEqual('translateY(75%)');
    });
  });

  describe('beforeDestroy', () => {
    it('removes the scroll event listener', () => {
      sinon.spy(window, 'removeEventListener');
      const wrapper = factory();

      wrapper.vm.beforeDestroy();

      expect(window.removeEventListener.calledWith('scroll', wrapper.vm.parallaxBackground)).toBe(true);
    });
  });
});
