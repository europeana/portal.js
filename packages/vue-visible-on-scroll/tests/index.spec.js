import { mount, createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';

import VisibleOnScrollDirective from '@/index.js';

const component = {
  template: '<div><p class="show" v-visible-on-scroll>Test</p></div>',
  directives: {
    'visible-on-scroll': VisibleOnScrollDirective
  }
};

const localVue = createLocalVue();

const factory = () => mount(component, {
  localVue,
  mocks: {
    $route: {}
  }
});

describe('VisibleOnScroll', () => {
  beforeAll(() => {
    // Scroll & related events only work client side
    process.browser = true;
  });

  it('adds window eventListener for resize', () => {
    sinon.spy(window, 'addEventListener');
    factory();

    expect(window.addEventListener.calledWith('resize', sinon.match.func)).toBe(true);
  });

  describe('when on desktop', () => {
    it('enables the visible on scroll effect', () => {
      window.innerWidth = 1200;
      const wrapper = factory();

      const visibleOnScrollElement = wrapper.findComponent('p');

      expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0);');
      expect(visibleOnScrollElement.classes()).toContain('show');
      expect(window.addEventListener.calledWith('scroll', sinon.match.func)).toBe(true);
      expect(window.addEventListener.calledWith('hashchange', sinon.match.func)).toBe(true);
    });
  });

  describe('when changing the viewport to smaller than desktop', () => {
    it('disables the visible on scroll effect', () => {
      window.innerWidth = 1200;
      sinon.spy(window, 'removeEventListener');
      const wrapper = factory();

      const visibleOnScrollElement = wrapper.findComponent('p');

      window.innerWidth = 400;
      window.dispatchEvent(new CustomEvent('resize'));

      expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0);');
      expect(visibleOnScrollElement.classes()).not.toContain('show');
      expect(window.removeEventListener.calledWith('scroll', sinon.match.func)).toBe(true);
      expect(window.removeEventListener.calledWith('hashchange', sinon.match.func)).toBe(true);
    });
  });

  describe('when changing the viewport from small to desktop', () => {
    it('enables the visible on scroll effect', () => {
      window.innerWidth = 400;
      const wrapper = factory();

      const visibleOnScrollElement = wrapper.findComponent('p');

      window.innerWidth = 1200;
      window.dispatchEvent(new CustomEvent('resize'));

      expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0);');
      expect(visibleOnScrollElement.classes()).toContain('show');
      expect(window.addEventListener.calledWith('scroll', sinon.match.func)).toBe(true);
      expect(window.addEventListener.calledWith('hashchange', sinon.match.func)).toBe(true);
    });
  });

  describe('handleScroll', () => {
    afterAll(() => {
      sinon.restore();
    });

    describe('when at the top (150px) of the screen', () => {
      describe('when scrolling down', () => {
        it('updates the scrollPosition', () => {
          const wrapper = factory();
          const visibleOnScrollElement = wrapper.findComponent('p');
          visibleOnScrollElement.element.scrollPosition = 20;

          window.scrollY = 140;
          window.dispatchEvent(new CustomEvent('scroll'));

          expect(visibleOnScrollElement.element.scrollPosition).toBe(140);
        });
      });

      describe('when scrolling up (more than 5px)', () => {
        it('updates the scrollPosition', () => {
          const wrapper = factory();
          const visibleOnScrollElement = wrapper.findComponent('p');
          visibleOnScrollElement.element.scrollPosition = 140;

          window.scrollY = 20;
          window.dispatchEvent(new CustomEvent('scroll'));

          expect(visibleOnScrollElement.element.scrollPosition).toBe(20);
        });

        // describe('when the element is NOT visible', () => {
        //   it('sets the visibility & transformation and adds the show class', () => {
        //     const wrapper = factory();
        //     const visibleOnScrollElement = wrapper.findComponent('p');
        //     visibleOnScrollElement.element.scrollPosition = 140;
        //     // wrapper.showElement = false;

        //     window.scrollY = 20;
        //     window.dispatchEvent(new CustomEvent('scroll'));

        //     expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0);');
        //     expect(visibleOnScrollElement.classes('show')).toBe(true);
        //     expect(visibleOnScrollElement.element.scrollPosition).toBe(20);
        //   });
        // });
      });
    });

    describe('when in the page (beyond 150px) of the screen', () => {
      describe('when scrolling down', () => {
        it('unsets the visibility, transforms the element -100% and removes the show class', () => {
          const wrapper = factory();
          const visibleOnScrollElement = wrapper.findComponent('p');
          visibleOnScrollElement.element.scrollPosition = 160;

          window.scrollY = 170;
          window.dispatchEvent(new CustomEvent('scroll'));

          expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, -100%, 0);');
          expect(visibleOnScrollElement.classes('show')).toBe(false);
          expect(visibleOnScrollElement.element.scrolledVisible).toBe(false);
          expect(visibleOnScrollElement.element.scrollPosition).toBe(170);
        });
      });

      describe('when scrolling up (more than 5px)', () => {
        describe('when the element is visible already', () => {
          it('updates the scrollPosition', () => {
            const wrapper = factory();
            const visibleOnScrollElement = wrapper.findComponent('p');
            visibleOnScrollElement.element.scrollPosition = 250;
            visibleOnScrollElement.element.scrolledVisible = true;

            window.scrollY = 200;
            window.dispatchEvent(new CustomEvent('scroll'));

            expect(visibleOnScrollElement.element.scrollPosition).toBe(200);
          });
        });

        describe('when the element is NOT visible', () => {
          it('sets the visibility & transformation and adds the show class', () => {
            const wrapper = factory();
            const visibleOnScrollElement = wrapper.findComponent('p');
            visibleOnScrollElement.element.scrollPosition = 250;
            visibleOnScrollElement.element.scrolledVisible = false;

            window.scrollY = 200;
            window.dispatchEvent(new CustomEvent('scroll'));

            expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0);');
            expect(visibleOnScrollElement.classes('show')).toBe(true);
            expect(visibleOnScrollElement.element.scrollPosition).toBe(200);
          });
        });
      });
    });
  });
});

