import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import LandingCallToAction from '@/components/landing/LandingCallToAction.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const testProps = { title: 'This is the title', text: 'this is the text', link: { text: 'link text', url: 'https://example.com/link' } };
const testPropsWithBackground = { ...testProps,
  backgroundImage: { image: { url: 'https://www.example.eu/img.jpg' } } };
const factory = (propsData = testProps) => shallowMount(LandingCallToAction, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveContentfulBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
      }
    }
  }
});

describe('components/landing/LandingCallToAction', () => {
  it('passes the props to a primaryCallToAction component', () => {
    const wrapper = factory();

    const ctaElement = wrapper.find('contentprimarycalltoaction-stub');

    expect(ctaElement.attributes('text')).toBe('this is the text');
    expect(ctaElement.attributes('link')).toBe('[object Object]');
    expect(ctaElement.attributes('title')).toBe('This is the title');
  });

  describe('when there is no background image', () => {
    it('is not displayed', () => {
      const wrapper = factory();

      const background = wrapper.find('[data-qa="landing cta background image"]');

      expect(background.exists()).toBe(false);
    });
  });
  describe('when there is a background image', () => {
    it('is displayed', () => {
      const wrapper = factory(testPropsWithBackground);

      const background = wrapper.find('[data-qa="landing cta background image"]');

      expect(background.exists()).toBe(true);
    });
  });

  describe('when the variant is ds4ch', () => {
    const testPropsDs4ch = {
      ...testPropsWithBackground,
      variant: 'ds4ch'
    };

    describe('and the image profile has "highlight" background', () => {
      const propsData = {
        ...testPropsDs4ch,
        backgroundImage: {
          image: { url: 'https://www.example.eu/img.jpg' },
          profile: { background: 'highlight' }
        }
      };

      it('adds the bg-color-highlight class to the background element', () => {
        const wrapper = factory(propsData);

        const backgroundColorHighlight = wrapper.find('[data-qa="landing cta background image"].bg-color-highlight');

        expect(backgroundColorHighlight.exists()).toBe(true);
      });
    });

    describe('and the image profile has `false` overlay', () => {
      const propsData = {
        ...testPropsDs4ch,
        backgroundImage: {
          image: { url: 'https://www.example.eu/img.jpg' },
          profile: { overlay: false }
        }
      };

      it('adds the no-overlay class to the background element', () => {
        const wrapper = factory(propsData);

        const backgroundNoOverlay = wrapper.find('[data-qa="landing cta background image"].no-overlay');

        expect(backgroundNoOverlay.exists()).toBe(true);
      });
    });

    describe('and the image profile has "left" focus', () => {
      const propsData = {
        ...testPropsDs4ch,
        backgroundImage: {
          image: { url: 'https://www.example.eu/img.jpg' },
          profile: { focus: 'left' }
        }
      };

      it('adds the bg-position-y-center class to the background element', () => {
        const wrapper = factory(propsData);

        const backgroundPositionYCenter = wrapper.find('[data-qa="landing cta background image"].bg-position-y-center');

        expect(backgroundPositionYCenter.exists()).toBe(true);
      });
    });

    describe('and the image profile has "right" focus', () => {
      const propsData = {
        ...testPropsDs4ch,
        backgroundImage: {
          image: { url: 'https://www.example.eu/img.jpg' },
          profile: { focus: 'right' }
        }
      };

      it('adds the bg-position-y-center class to the background element', () => {
        const wrapper = factory(propsData);

        const backgroundPositionYCenter = wrapper.find('[data-qa="landing cta background image"].bg-position-y-center');

        expect(backgroundPositionYCenter.exists()).toBe(true);
      });
    });
  });
});
