import sinon from 'sinon';

import Manager from '@/manager.js';

describe('Manager', () => {
  afterEach(sinon.reset);

  describe('constructor', () => {
    it('loads stored session', () => {
      const timestamp = Date.now();
      localStorage.setItem('session', `{"id":"uuid","timestamp":${timestamp}}`);

      const manager = new Manager();

      expect(manager.session.id).toBe('uuid');
    });

    it('does not touch session to update timestamp', () => {
      const timestamp = Date.now() - 1000;
      localStorage.setItem('session', `{"id":"uuid","timestamp":${timestamp}}`);

      const manager = new Manager();

      expect(manager.session.timestamp).toBe(timestamp);
    });

    it('starts monitoring, touching session on activity', () => {
      const manager = new Manager({ monitor: { events: ['wheel'] } });
      sinon.spy(manager.session, 'touch');
      // sinon.resetHistory();

      document.dispatchEvent(new WheelEvent('wheel'));

      expect(manager.session.touch.called).toBe(true);
    });
  });

  it('starts a new session when the current one expires', () => {
    const timeout = 10;
    const timestamp = Date.now() - (timeout * 60 * 1000 * 60) - 1;
    localStorage.setItem('session', `{"id":"uuid","timestamp":${timestamp}}`);

    const manager = new Manager({ session: { timeout } });

    expect(manager.session.id).not.toBe('uuid');
    expect(manager.session.id.length).toBe(36);
  });
});
