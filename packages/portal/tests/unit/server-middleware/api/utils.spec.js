import sinon from 'sinon';
import apm from 'elastic-apm-node';

import * as utils from '@/server-middleware/api/utils.js';

describe('server-middleware/api/utils', () => {
  afterEach(sinon.resetHistory);

  describe('forbiddenUnlessOriginAllowed', () => {
    const callback = sinon.spy();
    const origins = ['http://localhost:3000'];

    describe('when origin is among those permitted', () => {
      const origin = origins[0];

      it('calls the callback without an error', () => {
        utils.forbiddenUnlessOriginAllowed(origins)(origin, callback);

        expect(callback.calledWith(null, true)).toBe(true);
      });
    });

    describe('when origin is not among those permitted', () => {
      const origin = 'http://localhost:5173';

      it('calls the callback with a 403 error', () => {
        utils.forbiddenUnlessOriginAllowed(origins)(origin, callback);

        expect(callback.calledWith(
          sinon.match.instanceOf(Error).and(sinon.match.has('status', 403))
        )).toBe(true);
      });
    });
  });

  describe('nuxtRuntimeConfig', () => {
    describe('when no runtime config has been loaded', () => {
      it('loads the runtime config from the private and public configs', () => {
        const configForKey = utils.nuxtRuntimeConfig('app');

        expect(configForKey.siteName).toEqual('Europeana');
      });
    });
    describe('when called without a key', () => {
      it('returns the entire runtimeConfig', () => {
        const config = utils.nuxtRuntimeConfig();

        expect(config.app.siteName).toBe('Europeana');
      });
    });
  });

  describe('errorHandler', () => {
    it('logs to the console, logs to the apm and sends a response status', async() => {
      const err = { message: 'NOT FOUND', statusCode: 404 };
      const consoleStub = sinon.stub(console, 'error');
      const apmStartedStub = sinon.stub(apm, 'isStarted').returns(true);
      const apmCaptureStub = sinon.stub(apm, 'captureError');
      const resSendStub = sinon.stub();
      const res = {
        writableEnded: false,
        status: () => {
          return { send: resSendStub };
        }
      };

      await utils.errorHandler(err, {}, res, {});

      expect(consoleStub.calledOnce).toBe(true);
      expect(apmStartedStub.calledOnce).toBe(true);
      expect(apmCaptureStub.calledOnce).toBe(true);
      expect(resSendStub.calledOnce).toBe(true);
    });
  });
});
