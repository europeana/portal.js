import nock from 'nock';
nock.disableNetConnect();
import sinon from 'sinon';

import serviceDesk from '../../../../../src/server-middleware/api/jira/service-desk';

const options = {
  origin: 'https://europeana.atlassian.net',
  username: 'example@europeana.eu',
  password: 'YOUR_TOKEN',
  serviceDesk: {
    serviceDeskId: '7',
    requestTypeId: '81'
  }
};
const middleware = serviceDesk(options);

const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
  const res = {};
  res.sendStatus = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  res.set = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};
const mockJiraApiRequest = () => nock(options.origin).post('/rest/servicedeskapi/request');

describe('server-middleware/api/jira/service-desk', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('middleware', () => {
    describe('request handling', () => {
      it('sends a POST request to Jira service desk API', async() => {
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest();

        await middleware(req, res);

        nock.isDone().should.be.true;
      });
    });

    describe('response construction', () => {
      it('responds with upstream status on success', async() => {
        const status = 201;
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().reply(status);

        await middleware(req, res);

        res.sendStatus.should.have.been.calledWith(status);
      });
    });
  });
});
