import Storage from '@/storage.js';

describe('Storage', () => {
  describe('constructor', () => {
    describe('key', () => {
      it('includes prefix from 1st arg if supplied', () => {
        const storage = new Storage({ prefix: 'my.' });

        expect(storage.key).toBe('my.session');
      });

      it('is just "session" if no prefix supplied', () => {
        const storage = new Storage();

        expect(storage.key).toBe('session');
      });
    });
  });

  describe('data', () => {
    describe('getter', () => {
      describe('when localStorage contains nothing', () => {
        it('returns `null`', () => {
          localStorage.removeItem('session');
          const storage = new Storage();

          const data = storage.data;

          expect(data).toBe(null);
        });
      });

      describe('when localStorage contains valid JSON', () => {
        it('returns it', () => {
          localStorage.setItem('session', '{"id":"uuid","timestamp":0}');
          const storage = new Storage();

          const data = storage.data;

          expect(data).toEqual({ id: 'uuid', timestamp: 0 });
        });
      });

      describe('when localStorage contains invalid data', () => {
        it('returns `null`', () => {
          localStorage.setItem('session', 'something');
          const storage = new Storage();

          const data = storage.data;

          expect(data).toBe(null);
        });
      });
    });

    describe('setter', () => {
      it('writes data to localStorage', () => {
        localStorage.removeItem('session');
        const storage = new Storage();

        storage.data = { id: 'uuid', timestamp: 0 };

        expect(localStorage.getItem('session')).toEqual('{"id":"uuid","timestamp":0}');
      });
    });
  });

  describe('empty', () => {
    it('removes data from localStorage', () => {
      localStorage.setItem('session', '{"id":"uuid","timestamp":0}');
      const storage = new Storage();

      storage.empty();

      expect(localStorage.getItem('session')).toBe(null);
    });
  });
});
