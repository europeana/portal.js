import sinon from 'sinon';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import { useParallaxElement } from './parallaxElement.js';

const component = {
  template: `
    <div id="parallax-target"></div>
  `,
  setup() {
    useParallaxElement('#parallax-target');
  }
};

const localVue = createLocalVue();

const factory = () => shallowMount(component, {
  attachTo: document.body,
  propsData: {},
  mocks: {},
  localVue
});

describe('useActiveTab', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('when the window is scrolled', () => {
    describe('and element is above top of viewport', () => {
      it('sets a parallax effect on the element', async() => {
        const wrapper = factory();
        const element = wrapper.find('#parallax-target').element;
        sinon.stub(element, 'getBoundingClientRect').returns({
          top: -1
        });

        window.dispatchEvent(new Event('scroll'));

        expect(element.style.transform).toBe('translateY(75%)');
      });
    });

    describe('and element is below top of viewport', () => {
      it('clears any parallax effect from the element', async() => {
        const wrapper = factory();
        const element = wrapper.find('#parallax-target').element;
        sinon.stub(element, 'getBoundingClientRect').returns({
          top: 1
        });

        window.dispatchEvent(new Event('scroll'));

        expect(element.style.transform).toBe('');
      });
    });
  });
});
