import * as cachers from '@/cachers/index.js';
import sinon from 'sinon';

let processArgv;
let cachersCliStub;

describe('@/cachers/cli', () => {
  beforeAll(() => {
    cachersCliStub = sinon.stub(cachers, 'cli');

    processArgv = process.argv;
    process.argv = ['node', './cachers/cli.js', 'get', 'cache']
  });

  afterEach(sinon.resetHistory);

  afterAll(() => {
    process.argv = processArgv;
    sinon.restore();
  });

  it('runs cachers CLI with command-line args', async() => {
    const cli = () => import('@/cachers/cli.js');

    await cli();

    expect(cachersCliStub.calledWith('get', 'cache')).toBe(true);
  });
});
