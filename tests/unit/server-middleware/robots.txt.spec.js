import sinon from 'sinon';
import middleware from '@/server-middleware/robots.txt.js';

describe('server-middleware/robots.txt', () => {
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

  it('sends response with config from process.env if present', () => {
    const robotsTxt = 'User-agent: *\nDisallow: /';
    process.env.ROBOTS_TXT = robotsTxt;

    middleware(null, res);

    expect(res.end.calledWith(robotsTxt)).toBe(true);
    delete process.env.ROBOTS_TXT;
  });

  it('sends response with default permissive config', () => {
    const robotsTxt = 'User-agent: *\nAllow: /';

    middleware(null, res);

    expect(res.end.calledWith(robotsTxt)).toBe(true);
  });
});
