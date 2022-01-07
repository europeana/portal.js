import sinon from 'sinon';
import middleware from '@/server-middleware/api/debug/memory-usage.js';

describe('server-middleware/api/debug/memory-usage', () => {
  it('sends JSON response with process memory usage data', () => {
    const res = {
      json: sinon.spy()
    };
    const processMemoryUsageStub = sinon.stub(process, 'memoryUsage').returns('10 MB');

    middleware(null, res);

    expect(res.json.calledWith('10 MB')).toBe(true);

    processMemoryUsageStub.restore();
  });
});
