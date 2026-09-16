import sinon from 'sinon';

import { createApiExpressApp } from './index.js';

describe('server-middleware/api/index.js', () => {
  const fakeExpressApp = {
    app: sinon.stub(),
    disable: sinon.stub(),
    use: sinon.stub(),
    get: sinon.stub(),
    post: sinon.stub(),
    options: sinon.stub(),
    all: sinon.stub()
  };
  const nuxtContext = {
    $config: {}
  };

  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    sinon.restore();
  });

  describe('createApiExpressApp', () => {
    it('disables "x-powered-by" response header for security reasons', () => {
      createApiExpressApp(nuxtContext, fakeExpressApp);

      expect(fakeExpressApp.disable.calledWith('x-powered-by')).toBe(true);
    });

    it('uses a catch-all 404 handler for unregistered routes', () => {
      createApiExpressApp(nuxtContext, fakeExpressApp);

      expect(fakeExpressApp.all.calledWith(
        '/*',
        sinon.match((value) => {
          const res = { sendStatus: sinon.spy() };
          value?.(null, res);
          return res.sendStatus.calledWith(404);
        })
      )).toBe(true);
    });
  });
});
