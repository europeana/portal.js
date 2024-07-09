import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import VueI18n from 'vue-i18n';
import sinon from 'sinon';

import HomeHero from '@/components/home/HomeHero.vue';

const localVue = createLocalVue();
localVue.use(VueI18n);

const factory = (propsData) => shallowMountNuxt(HomeHero, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    },
    $t: () => {}
  }
});

describe('components/home/HomeHero', () => {
  describe('imageCSSVars computed property', () => {
    describe('when there is a background image available', () => {
      it('returns background style definitions', () => {
        const wrapper = factory({ backgroundImage: { image: { url: 'https://www.europeana.eu/example.jpg' } } });

        expect(wrapper.vm.imageCSSVars).toBeTruthy();
      });
    });
  });

  describe('when the page is scrolled', () => {
    it('sets transform styles on the background', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm, 'transformBackground');
      window.dispatchEvent(new Event('scroll'));

      expect(wrapper.vm.$refs.heroBackground.style.transform).toEqual('scale(1.25)');
    });
  });

  describe('beforeDestroy', () => {
    it('removes the scroll event listener', () => {
      sinon.spy(window, 'removeEventListener');
      const wrapper = factory();

      wrapper.vm.beforeDestroy();

      expect(window.removeEventListener.calledWith('scroll', wrapper.vm.transformBackground)).toBe(true);
    });
  });
});
