import VueSession from '@/index.js';
import Session from '@/session.js';

class Vue {}

describe('VueSession', () => {
  describe('install', () => {
    it('adds property $session to Vue prototype', () => {
      VueSession.install(Vue);

      expect(Vue.prototype.$session).toBeDefined();
    });
  });

  describe('Vue.prototype.$session', () => {
    it('is an instance of Session', () => {
      VueSession.install(Vue);

      expect(Vue.prototype.$session instanceof Session).toBe(true);
    });
  });
});
