import * as store from '../../../store/request';
import sinon from 'sinon';

describe('store/request', () => {
  describe('actions', () => {
    it('adds current domain to state', async() => {
      const commit = sinon.spy();
      const req = {
        host: 'www.example.org'
      };

      await store.actions.domain({ commit }, { req });

      commit.should.have.been.calledWith('setDomain', req.host);
    });
  });

  describe('mutations', () => {
    it('joins both domain name and top level domain together with a `.` and then sets state', () => {
      const host = 'example.org';
      const state = {
        domain: null
      };

      store.mutations.setDomain(state, host);

      state.domain.should.eq('example.org');
    });
  });
});
