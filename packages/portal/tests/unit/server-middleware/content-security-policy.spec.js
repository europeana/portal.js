import sinon from 'sinon';
import middleware from '@/server-middleware/content-security-policy.js';

describe('server-middleware/content-security-policy', () => {
  const res = { setHeader: sinon.spy() };
  const next = sinon.spy();

  afterEach(sinon.resetHistory);

  it('sets Content-Security-Policy response header to "upgrade-insecure-requests"', () => {
    middleware(null, res, next);

    expect(res.setHeader.calledWith('Content-Security-Policy', 'upgrade-insecure-requests')).toBe(true);
  });

  it('calls next', () => {
    middleware(null, res, next);

    expect(next.called).toBe(true);
  });
});
