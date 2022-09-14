import plugin from '@/plugins/user-likes.client';
import sinon from 'sinon';

describe('@/plugins/user-likes.client', () => {
  describe('when logged in', () => {
    const $auth = { loggedIn: true };

    it('gets the user\'s likes set ID via the store', async() => {
      const store = { dispatch: sinon.spy() };

      await plugin({ $auth, store });

      expect(store.dispatch.calledWith('set/setLikes')).toBe(true);
    });

    it('gets the user\'s likes via the store', async() => {
      const store = { dispatch: sinon.spy() };

      await plugin({ $auth, store });

      expect(store.dispatch.calledWith('set/fetchLikes')).toBe(true);
    });
  });

  describe('when not logged in', () => {
    const $auth = { loggedIn: false };

    it('does not get anything via the store', async() => {
      const store = { dispatch: sinon.spy() };

      await plugin({ $auth, store });

      expect(store.dispatch.called).toBe(false);
    });
  });
});
