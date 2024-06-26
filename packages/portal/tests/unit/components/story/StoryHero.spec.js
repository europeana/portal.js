import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import StoryHero from '@/components/story/StoryHero.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const baseProps = { title: 'This is a title',
  heroImage: { image: { url: 'https://www.europeana.eu/example.jpg', height: 1000, contentType: 'image/jpeg' } } };

const factory = (propsData = baseProps) => mountNuxt(StoryHero, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/story/StoryHero', () => {
  describe('when the page is scrolled', () => {
    it('sets transform styles on the background', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'parallaxBackground');
      const heroBackgroundImageElement = document.querySelector('#hero-background-image img');

      sinon.stub(heroBackgroundImageElement, 'getBoundingClientRect').returns({ top: -1 });

      window.dispatchEvent(new Event('scroll'));

      expect(heroBackgroundImageElement.style.transform).toEqual('translateY(75%)');
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
