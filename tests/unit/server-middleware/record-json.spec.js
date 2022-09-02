import sinon from 'sinon';
import middleware from '@/server-middleware/record-json.js';

describe('server-middleware/record-json', () => {
  const res = { writeHead: sinon.spy(), end: sinon.spy() };
  const next = sinon.spy();

  afterEach(sinon.resetHistory);

  describe('when request URL is for an item, with .json suffix', () => {
    const req = {
      url: '/fr/item/123/abc.json'
    };

    it('redirects to item page with #api-requests hash', () => {
      const location = '/fr/item/123/abc#api-requests';

      middleware(req, res, next);

      expect(res.writeHead.calledWith(302, { location })).toBe(true);
      expect(res.end.called).toBe(true);
      expect(next.called).toBe(false);
    });
  });

  describe('when request URL is for anything else', () => {
    const req = {
      url: '/fr/collections'
    };

    it('calls next', () => {
      middleware(req, res, next);

      expect(next.called).toBe(true);
    });
  });
});
