import sinon from 'sinon';

import VueSession from '@/index.js';
import Session from '@/session.js';

describe('VueSession', () => {
  afterEach(sinon.reset);

  describe('install', () => {
    it('adds property $session to Vue prototype', () => {
      class Vue {}

      VueSession.install(Vue);

      expect(Vue.prototype.$session).toBeDefined();
    });

    it('does not install if user agent is a bot', () => {
      class Vue {}
      const userAgent = navigator.userAgent;
      sinon.stub(navigator, 'userAgent').get(() => 'well-intentioned and well-behaved Bot; >:D');

      VueSession.install(Vue);

      expect(Vue.prototype.$session).toBeUndefined();

      // sinon.reset doesn't seem to restore the getter to its default...
      sinon.stub(navigator, 'userAgent').get(() => userAgent);
    });
  });

  describe('Vue.prototype.$session', () => {
    it('is an instance of Session', () => {
      class Vue {}

      VueSession.install(Vue);

      expect(Vue.prototype.$session instanceof Session).toBe(true);
    });
  });
});
