import sinon from 'sinon';
import middleware from '@/server-middleware/api/version.js';

import { version } from '../../../package.json';

describe('server-middleware/api/version', () => {
  const res = {
    setHeader: sinon.spy(),
    end: sinon.spy()
  };

  beforeEach(() => {
    res.setHeader.resetHistory();
    res.end.resetHistory();
  });

  it('sets Content-Type response header to "text/plain"', () => {
    middleware(null, res);

    expect(res.setHeader.calledWith('Content-Type', 'text/plain')).toBe(true);
  });

  it('sends app version in response', () => {
    middleware(null, res);

    expect(res.end.calledWith(version)).toBe(true);
  });
});
