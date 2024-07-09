import sinon from 'sinon';

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
});
