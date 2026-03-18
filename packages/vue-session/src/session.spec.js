import Session from '@/session.js';

describe('Session', () => {
  describe('constructor', () => {
    describe('id', () => {
      it('is set from id from 1st arg if supplied', () => {
        const session = new Session({ id: 'yay' });

        expect(session.id).toBe('yay');
      });

      it('is a generated UUID v4 if none supplied', () => {
        const session = new Session();

        expect(typeof session.id === 'string').toBe(true);
        expect(session.id.length).toBe(36);
      });
    });

    describe('timestamp', () => {
      it('is set from timestamp from 1st arg if supplied', () => {
        const timestamp = 1697789875911;
        const session = new Session({ timestamp });

        expect(session.timestamp).toBe(timestamp);
      });

      it('generates a Unix timestamp if none supplied', () => {
        const session = new Session();

        expect(typeof session.timestamp === 'number').toBe(true);
      });
    });

    describe('timeout', () => {
      it('is set from timeout from 2nd arg if supplied', () => {
        const timeout = 10;
        const session = new Session(null, { timeout });

        expect(session.timeout).toBe(timeout);
      });

      it('defaults to 30 if none supplied', () => {
        const session = new Session();

        expect(session.timeout).toBe(30);
      });
    });
  });

  describe('hasExpired', () => {
    it('is `true` if the timestamp is older than the timeout', () => {
      const timeout = 10;
      const timestamp = Date.now() - ((timeout + 1) * 60 * 1000);
      const session = new Session({ timestamp }, { timeout });

      expect(session.hasExpired).toBe(true);
    });

    it('is `false` if the timestamp is not older than the timeout', () => {
      const timeout = 10;
      const timestamp = Date.now() + (60 * 1000);
      const session = new Session({ timestamp }, { timeout });

      expect(session.hasExpired).toBe(false);
    });
  });

  describe('isActive', () => {
    it('starts `false`', () => {
      const session = new Session();

      expect(session.isActive).toBe(false);
    });

    describe('when session touched', () => {
      it('becomes `true`', () => {
        const timeout = 10;
        const timestamp = Date.now() - ((timeout + 1) * 60 * 1000);
        const session = new Session({}, { timeout });

        session.touch();
        session.timestamp = timestamp;

        expect(session.isActive).toBe(false);
      });

      it('is `false` again if session expired', () => {
        const session = new Session();

        session.touch();

        expect(session.isActive).toBe(true);
      });
    });
  });

  describe('touch', () => {
    it('updates the timestamp', () => {
      const timestamp = Date.now() - (60 * 1000);
      const session = new Session({ timestamp });

      session.touch();

      expect(session.timestamp).toBeGreaterThan(timestamp);
    });
  });
});
