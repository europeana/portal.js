import sinon from 'sinon';

import VueSessionId from '@/index.js';

class Vue {}

describe('VueSessionId', () => {
  describe('install', () => {
    it('adds property $sessionId to Vue prototype', () => {
      // const vue = sinon.spy();
      // const vue = new Vue;
      VueSessionId.install(Vue);

      expect(Vue.prototype.$sessionId).toBeDefined();
    })
  });
});
