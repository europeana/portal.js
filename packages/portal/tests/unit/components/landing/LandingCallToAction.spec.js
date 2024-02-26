import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import LandingCallToAction from '@/components/landing/LandingCallToAction.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const testProps = { title: 'This is the title', text: 'this is the text', link: { text: 'link text', url: 'https://example.com/link' } };
const testPropsWithBackground = { ...testProps,
  backgroundImage: { image: { url: 'https://www.example.eu/img.jpg' } } };
const testPropsDs4ch = {
  ...testPropsWithBackground, variant: 'ds4ch'
};
const testPropsTwinItBackground = {
  ...testPropsDs4ch,
  backgroundImage: { image: { title: 'Twin it! background', url: 'https://www.example.eu/img.jpg' } }
};
const factory = (propsData = testProps) => shallowMount(LandingCallToAction, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      assets: {
        responsiveBackgroundImageCSSVars: (img, sizes) => Object.keys(sizes)
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
    expect(ctaElement.attributes('title')).toBeFalsy();
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
    it('passes a title prop', () => {
      const wrapper = factory(testPropsDs4ch);

      const ctaElement = wrapper.find('contentprimarycalltoaction-stub');

      expect(ctaElement.attributes('title')).toBe('This is the title');
    });
    describe('and the background image needs specific Twin it images and styles', () => {
      it('add the twin-it class to the background element', () => {
        const wrapper = factory(testPropsTwinItBackground);

        const backgroundTwinIt = wrapper.find('[data-qa="landing cta background image"].twin-it');

        expect(backgroundTwinIt.exists()).toBe(true);
      });
    });
  });
});
