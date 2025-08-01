import sinon from 'sinon';

import { actions } from '@/store/index.js';

describe('store/index.js', () => {
  beforeEach(() => sinon.resetHistory());

  const store = {
    commit: sinon.spy(),
    dispatch: sinon.spy()
  };
  const context = {
    $cookies: {
      get: sinon.stub().withArgs('searchResultsView').returns('list')
    }
  };

  describe('actions', () => {
    describe('nuxtServerInit', () => {
      it('commits apis/init with the context', () => {
        actions.nuxtServerInit(store, context);

        expect(store.commit.calledWith('apis/init', context)).toBe(true);
      });

      it('commits search/setView with the searchResultsView cookie', () => {
        actions.nuxtServerInit(store, context);

        expect(store.commit.calledWith('search/setView', 'list')).toBe(true);
      });
    });
  });
});
