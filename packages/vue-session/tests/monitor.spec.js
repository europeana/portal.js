import sinon from 'sinon';

import Monitor from '@/monitor.js';

const callback = sinon.stub();

describe('Monitor', () => {
  afterEach(sinon.reset);

  describe('constructor', () => {
    describe('callback', () => {
      it('is set from 1st arg', () => {
        const monitor = new Monitor(callback);

        expect(monitor.callback).toBe(callback);
      });
    });

    describe('events', () => {
      it('is set from 2nd arg if supplied', () => {
        const monitor = new Monitor(callback, { events: ['keydown'] });

        expect(monitor.events).toEqual(['keydown']);
      });

      it('defaults if not supplied', () => {
        const monitor = new Monitor(callback);

        expect(monitor.events).toEqual(
          ['drag', 'keydown', 'mousedown', 'mousemove', 'scroll', 'touchstart', 'wheel']
        );
      });
    });

    describe('interval', () => {
      it('is set from 2nd arg if supplied', () => {
        const monitor = new Monitor(callback, { interval: 120 });

        expect(monitor.interval).toBe(120);
      });

      it('defaults to 60 if not supplied', () => {
        const monitor = new Monitor(callback);

        expect(monitor.interval).toBe(60);
      });
    });

    it('adds event listeners', () => {
      sinon.spy(document, 'addEventListener');
      new Monitor(callback, { events: ['keydown', 'wheel'] });

      expect(document.addEventListener.calledWith('keydown', sinon.match.func)).toBe(true);
      expect(document.addEventListener.calledWith('wheel', sinon.match.func)).toBe(true);
    });
  });

  describe('listener', () => {
    it('calls the callback when triggered', () => {
      new Monitor(callback, { events: ['wheel'] });

      document.dispatchEvent(new WheelEvent('wheel'));

      expect(callback.called).toBe(true);
    });

    it('pauses itself for an interval', () => {
      sinon.spy(document, 'removeEventListener');
      sinon.spy(global, 'setTimeout');
      new Monitor(callback, { events: ['wheel'], interval: 120 });

      document.dispatchEvent(new WheelEvent('wheel'));

      expect(setTimeout.calledWith(sinon.match.func, 120000)).toBe(true);
      expect(document.removeEventListener.calledWith('wheel', sinon.match.func)).toBe(true);
    });
  });
});
