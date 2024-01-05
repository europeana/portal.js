import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import LandingHero from '@/components/landing/LandingHero.vue';

const localVue = createLocalVue();

const SRCSET_PRESETS_DS4CH = {
  small: { w: 576, h: 646, fit: 'fill', f: 'face' },
  medium: { w: 768, h: 514, fit: 'fill', f: 'face' },
  large: { w: 992, h: 604, fit: 'fill', f: 'face' },
  xl: { w: 1200, h: 604, fit: 'fill', f: 'face' },
  xxl: { w: 1400, h: 604, fit: 'fill', f: 'face' },
  xxxl: { w: 1880, h: 604, fit: 'fill', f: 'face' },
  wqhd: { w: 2520, h: 604, fit: 'fill', f: 'face' },
  '4k': { w: 3020, h: 1208, fit: 'fill', f: 'face' }
};

const factory = (propsData) => shallowMountNuxt(LandingHero, {
  localVue,
  propsData: {
    headline: 'This page is awesome',
    ...propsData
  },
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    }
  },
  stubs: ['b-container']
});

describe('components/landing/LandingHero', () => {
  describe('computed', () => {
    describe('imageCSSVars', () => {
      describe('when there is a hero image available', () => {
        it('returns background style definitions', () => {
          const wrapper = factory({ heroImage: { image: { url: 'https://www.europeana.eu/example.jpg' } } });

          expect(wrapper.vm.imageCSSVars).toBeTruthy();
        });
      });
    });

    describe('srcSetPreset', () => {
      describe('when the variant is ds4ch', () => {
        it('uses the DS4CH preset', () => {
          const wrapper = factory({ variant: 'ds4ch' });

          expect(wrapper.vm.srcSetPreset).toEqual(SRCSET_PRESETS_DS4CH);
        });
      });
    });
  });

  describe('ds4ch variant', () => {
    describe('when the page is scrolled', () => {
      it('sets transform styles on the background', () => {
        const wrapper = factory({ variant: 'ds4ch' });
        sinon.spy(wrapper.vm, 'transformBackground');
        window.dispatchEvent(new Event('scroll'));

        expect(wrapper.vm.$refs.heroBackground.style.transform).toEqual('scale(1.25)');
      });
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
