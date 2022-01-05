import morgan from 'morgan';
import sinon from 'sinon';
const middleware = () => import('@/server-middleware/logging.js');

describe('server-middleware/logging', () => {
  it('uses "combined" morgan formatting', async() => {
    const morganStub = sinon.stub(morgan, 'default');

    await middleware();

    expect(morganStub.calledWith('combined'));

    morganStub.restore();
  });
});
