import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import CallToActionBanner from '@/components/generic/CallToActionBanner';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  name: 'CTA',
  nameEnglish: 'CTA in English',
  text: '**Attention!**',
  link: {
    url: '/attention',
    text: 'Read more'
  },
  illustration: { image: {
    url: 'https://www.europeana.eu/illustration.svg',
    width: 100,
    height: 100
  } }
};

const factory = () => shallowMountNuxt(CallToActionBanner, {
  localVue,
  propsData,
  mocks: {
    $matomo: {
      trackEvent: sinon.spy()
    }
  }
});

describe('components/generic/CallToActionBanner', () => {
  describe('computed', () => {
    describe('html', () => {
      it('converts CTA text Markdown to HTML', () => {
        const wrapper = factory();

        expect(wrapper.vm.html).toBe('<p><strong>Attention!</strong></p>\n');
      });
    });
  });

  describe('methods', () => {
    describe('handleClickEvent', () => {
      it('tracks the link click event in Matomo', () => {
        const wrapper = factory();

        wrapper.vm.handleClickEvent();

        expect(wrapper.vm.$matomo.trackEvent.calledWith('CTA banner', 'Click CTA banner link', 'CTA banner: CTA in English')).toBe(true);
      });
    });
  });
});
