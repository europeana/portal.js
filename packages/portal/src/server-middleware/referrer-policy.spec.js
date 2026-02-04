import sinon from 'sinon';
import middleware from '@/server-middleware/referrer-policy.js';

describe('server-middleware/referrer-policy', () => {
  const res = { setHeader: sinon.spy() };
  const next = sinon.spy();

  beforeEach(() => {
    res.setHeader.resetHistory();
    next.resetHistory();
  });

  it('sets Referrer-Policy response header to "strict-origin-when-cross-origin"', () => {
    middleware(null, res, next);

    expect(res.setHeader.calledWith('Referrer-Policy', 'strict-origin-when-cross-origin')).toBe(true);
  });

  it('calls next', () => {
    middleware(null, res, next);

    expect(next.called).toBe(true);
  });
});
