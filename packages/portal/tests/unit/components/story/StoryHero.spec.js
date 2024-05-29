import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import StoryHero from '@/components/story/StoryHero.vue';
import sinon from 'sinon';

const localVue = createLocalVue();

const baseProps = { title: 'This is a title',
  hero: { image: { url: 'https://www.europeana.eu/example.jpg', height: 800 } } };

const factory = (propsData = baseProps) => shallowMountNuxt(StoryHero, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    },
    $t: () => {}
  },
  stubs: ['b-container', 'b-col']
});

describe('components/story/StoryHero', () => {
  describe('when there is a background image available', () => {
    it('returns background style definitions', () => {
      const wrapper = factory();

      expect(wrapper.vm.imageCSSVars).toBeTruthy();
    });
  });

  describe('when the page is scrolled', () => {
    it('sets transform styles on the background', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'parallaxBackground');
      window.dispatchEvent(new Event('scroll'));

      expect(wrapper.vm.$refs.heroBackground.style.transform).toEqual('translateY(75%)');
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
