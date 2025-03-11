import plugin from '@/plugins/user-likes.client';
import sinon from 'sinon';

const factory = ({ $auth } = {}) => {
  return {
    $auth,
    store: { commit: sinon.spy() },
    $apis: { set: { getLikes: sinon.stub().resolves('123') } }
  };
};

describe('@/plugins/user-likes.client', () => {
  describe('when logged in', () => {
    const $auth = { loggedIn: true };

    it('gets the user\'s likes set ID via the set API', async() => {
      const context = factory({ $auth });

      await plugin(context);

      expect(context.$apis.set.getLikes.called).toBe(true);
    });

    it('commits the likes set ID to the store', async() => {
      const context = factory({ $auth });

      await plugin(context);

      expect(context.store.commit.calledWith('set/setLikesId', '123')).toBe(true);
    });
  });

  describe('when not logged in', () => {
    const $auth = { loggedIn: false };

    it('does not get anything via the API', async() => {
      const context = factory({ $auth });

      await plugin(context);

      expect(context.$apis.set.getLikes.called).toBe(false);
    });
  });
});
