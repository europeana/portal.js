import sinon from 'sinon';
import useScrollTo from '@/composables/scrollTo.js';

describe('useScrollTo', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('queue array', () => {
    it('is included in return value', () => {
      const { queue } = useScrollTo();

      expect(queue.value).toEqual([]);
    });
  });

  describe('scrolling boolean', () => {
    it('is included in return value', () => {
      const { scrolling } = useScrollTo();

      expect(scrolling.value).toBe(false);
    });
  });

  describe('scrollToElement function', () => {
    it('is included in return value', () => {
      const { scrollToElement } = useScrollTo();

      expect(typeof scrollToElement).toBe('function');
    });

    it('smooth scrolls container to element', () => {
      const container = {
        scroll: sinon.spy()
      };
      const element = {
        offsetLeft: 10,
        offsetTop: 20
      };

      const { scrollToElement } = useScrollTo();
      scrollToElement(element, { container });

      expect(container.scroll.calledWith({ behavior: 'smooth', left: 10, top: 20 })).toBe(true);
    });

    it('applies optional offsets if given', () => {
      const container = {
        scroll: sinon.spy()
      };
      const element = {
        offsetLeft: 10,
        offsetTop: 20
      };

      const { scrollToElement } = useScrollTo();
      scrollToElement(element, { container, offsetLeft: 5, offsetTop: -5 });

      expect(container.scroll.calledWith({ behavior: 'smooth', left: 15, top: 15 })).toBe(true);
    });

    it('enqueues additional scroll requests, once per element', () => {
      const container = {
        scroll: sinon.spy()
      };
      const element = {
        offsetLeft: 10,
        offsetTop: 20
      };

      const { queue, scrollToElement } = useScrollTo();
      scrollToElement(element, { container });
      scrollToElement(element, { container });
      scrollToElement(element, { container });

      expect(queue.value.length).toBe(1);
    });
  });

  describe('scrollElementToCentre function', () => {
    it('is included in return value', () => {
      const { scrollElementToCentre } = useScrollTo();

      expect(typeof scrollElementToCentre).toBe('function');
    });

    it('smooth scrolls container to centre element', () => {
      const container = {
        offsetHeight: 200,
        offsetWidth: 100,
        scroll: sinon.spy()
      };
      const element = {
        offsetHeight: 40,
        offsetLeft: 50,
        offsetTop: 100,
        offsetWidth: 30
      };

      const { scrollElementToCentre } = useScrollTo();
      scrollElementToCentre(element, { container });

      expect(container.scroll.calledWith({ behavior: 'smooth', left: 15, top: 20 })).toBe(true);
    });
  });
});
