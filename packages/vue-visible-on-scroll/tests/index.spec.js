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

  it('adds window eventListeners for scroll, orientationChange and hashChange', () => {
    sinon.spy(window, 'addEventListener');
    factory();

    expect(window.addEventListener.calledWith('scroll', sinon.match.func)).toBe(true);
    expect(window.addEventListener.calledWith('orientationchange', sinon.match.func)).toBe(true);
    expect(window.addEventListener.calledWith('hashchange', sinon.match.func)).toBe(true);
  });

  it('sets the default transformation on the element', () => {
    const wrapper = factory();
    const visibleOnScrollElement = wrapper.findComponent('p');
    expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0)');
  });

  describe('handleScroll', () => {
    describe('on desktop', () => {
      beforeAll(() => {
        sinon.stub(document.documentElement, 'clientWidth').value(1200);
      });
      afterAll(() => {
        sinon.restore();
      });

      describe('when at the top (150px) of the screen', () => {
        describe('when scrolling down', () => {
          describe('when the element is visible already (should always be the case)', () => {
            it('updates the scrollPosition', () => {
              const wrapper = factory();
              const visibleOnScrollElement = wrapper.findComponent('p');
              visibleOnScrollElement.element.scrollPosition = 20;
              visibleOnScrollElement.element.scrolledVisible = true;

              window.scrollY = 140;
              window.dispatchEvent(new CustomEvent('scroll', {}));

              expect(visibleOnScrollElement.element.scrollPosition).toBe(140);
            });
          });
        });

        describe('when scrolling up (more than 5px)', () => {
          describe('when the element is visible already', () => {
            it('updates the scrollPosition', () => {
              const wrapper = factory();
              const visibleOnScrollElement = wrapper.findComponent('p');
              visibleOnScrollElement.element.scrollPosition = 140;
              visibleOnScrollElement.element.scrolledVisible = true;

              window.scrollY = 20;
              window.dispatchEvent(new CustomEvent('scroll', {}));

              expect(visibleOnScrollElement.element.scrollPosition).toBe(20);
            });
          });

          describe('when the element is NOT visible', () => {
            it('sets the visibility & transformation and adds the show class', () => {
              const wrapper = factory();
              const visibleOnScrollElement = wrapper.findComponent('p');
              visibleOnScrollElement.element.scrollPosition = 140;
              visibleOnScrollElement.element.scrolledVisible = false;

              window.scrollY = 20;
              window.dispatchEvent(new CustomEvent('scroll', {}));

              expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0)');
              expect(visibleOnScrollElement.classes('show')).toBe(true);
              expect(visibleOnScrollElement.element.scrollPosition).toBe(20);
            });
          });
        });
      });

      describe('when in the page (beyond 150px) of the screen', () => {
        describe('when scrolling down', () => {
          it('unsets the visibility, transforms the element -100% and removes the show class', () => {
            const wrapper = factory();
            const visibleOnScrollElement = wrapper.findComponent('p');
            visibleOnScrollElement.element.scrollPosition = 160;

            window.scrollY = 170;
            window.dispatchEvent(new CustomEvent('scroll', {}));

            expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, -100%, 0)');
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
              window.dispatchEvent(new CustomEvent('scroll', {}));

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
              window.dispatchEvent(new CustomEvent('scroll', {}));

              expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0)');
              expect(visibleOnScrollElement.classes('show')).toBe(true);
              expect(visibleOnScrollElement.element.scrollPosition).toBe(200);
            });
          });
        });
      });
    });

    describe('on mobile', () => {
      beforeAll(() => {
        sinon.stub(document.documentElement, 'clientWidth').value(600);
      });
      afterAll(() => {
        sinon.restore();
      });

      it('updates the scrollPosition', () => {
        const wrapper = factory();
        const visibleOnScrollElement = wrapper.findComponent('p');

        window.scrollY = 200;
        window.dispatchEvent(new CustomEvent('scroll', {}));

        expect(visibleOnScrollElement.element.scrollPosition).toBe(200);
      });
    });
  });

  describe('handleOrientationChange', () => {
    it('resets the transformation and updates the scrolledVisible property', () => {
      const wrapper = factory();
      const visibleOnScrollElement = wrapper.findComponent('p');
      visibleOnScrollElement.element.scrolledVisible = false;

      window.orientation = 180;
      window.dispatchEvent(new CustomEvent('orientationchange', {}));

      expect(visibleOnScrollElement.attributes('style')).toBe('transform: translate3d(0, 0, 0)');
      expect(visibleOnScrollElement.element.scrolledVisible).toBe(true);
    });
  });
});

