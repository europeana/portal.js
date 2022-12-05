import galleryPublicationServiceDesk from '@/server-middleware/api/jira-service-desk/galleries';

import nock from 'nock';
nock.disableNetConnect();
import sinon from 'sinon';

const options = {
  origin: 'https://jira.example.org',
  serviceDesk: {
    galleries: {
      username: 'example@europeana.eu',
      password: 'YOUR_TOKEN',
      serviceDeskId: '01',
      requestTypeId: '02'
    }
  }
};
const middleware = galleryPublicationServiceDesk(options);

const mockRequest = (body = { submission: 'Set ID: 001  Set creator: user001', email: 'user@example.eu' }) => ({ body });
const mockResponse = () => {
  const res = {};
  res.sendStatus = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  return res;
};
const mockJiraApiRequest = body => nock(options.origin).post('/rest/servicedeskapi/request', body);

describe('server-middleware/api/jira-service-desk/galleries', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('middleware', () => {
    describe('request handling', () => {
      it('sends a POST request to Jira service desk API', async() => {
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().reply(201);

        await middleware(req, res);

        expect(nock.isDone()).toBe(true);
      });
    });
  });
});
