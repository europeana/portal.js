import sinon from 'sinon';

import plugin from '@/modules/http/templates/plugin.http';

describe('modules/http/templates/plugin.http', () => {
  afterEach(sinon.resetHistory);

  describe('default export', () => {
    const inject = sinon.spy();

    it('injects the plugin into the context as "http"', () => {
      plugin({}, inject);

      expect(inject.calledWith(sinon.match.object, 'http'));
    });

    it('registers the store module', () => {
      const store = {
        registerModule: sinon.spy()
      };

      plugin({ store }, inject);

      expect(store.registerModule.calledWith('http', sinon.match.object));
    });
  });
});
