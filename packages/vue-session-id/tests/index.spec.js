import VueSessionId from '@/index.js';

class Vue {}

describe('VueSessionId', () => {
  describe('install', () => {
    it('adds property $sessionId to Vue prototype', () => {
      VueSessionId.install(Vue);

      expect(Vue.prototype.$sessionId).toBeDefined();
    });
  });
});
