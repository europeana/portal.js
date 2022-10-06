import sinon from 'sinon';

import plugin from '@/modules/http/templates/plugin.http';

describe('modules/http/templates/plugin.http', () => {
  afterEach(sinon.resetHistory);

  describe('default export', () => {
    const context = {
      store: {
        registerModule: sinon.spy()
      }
    };
    const inject = sinon.spy();

    it('injects the plugin into the context as "http"', () => {
      plugin(context, inject);

      expect(inject.calledWith('http', sinon.match.object)).toBe(true);
    });

    it('registers the store module', () => {
      plugin(context, inject);

      expect(context.store.registerModule.calledWith('http', sinon.match.object)).toBe(true);
    });
  });
});
