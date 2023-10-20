import VueSession from '@/index.js';

class Vue {}

describe('VueSession', () => {
  describe('install', () => {
    it('adds property $session to Vue prototype', () => {
      VueSession.install(Vue);

      expect(Vue.prototype.$session).toBeDefined();
    });
  });
});
