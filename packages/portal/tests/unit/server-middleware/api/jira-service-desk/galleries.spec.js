import galleryPublicationServiceDesk from '@/server-middleware/api/jira-service-desk/galleries';

import nock from 'nock';
import sinon from 'sinon';

const options = {
  origin: 'https://jira.example.org',
  serviceDesk: {
    galleries: {
      username: 'example@europeana.eu',
      password: 'YOUR_TOKEN',
      serviceDeskId: '01',
      requestTypeId: '02',
      customFields: {
        setId: 'custom_field_001',
        setCreatorNickname: 'custom_field_002'
      }
    }
  }
};
const middleware = galleryPublicationServiceDesk(options);

const mockResponse = () => {
  const res = {};
  res.sendStatus = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  res.set = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};
const mockJiraApiRequest = (body) => nock(options.origin).post('/rest/servicedeskapi/request', body);

describe('server-middleware/api/jira-service-desk/galleries', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('middleware', () => {
    describe('request handling', () => {
      it('sends a POST request to Jira service desk API', async() => {
        const req = {
          body: {
            email: 'user@example.eu',
            setTitle: 'Test set',
            setDescription: 'About the set',
            setId: 'http://data.europeana.eu/set/1',
            setCreatorNickname: 'user1'
          }
        };
        const res = mockResponse();
        const jiraApiRequestBody = {
          serviceDeskId: options.serviceDesk.galleries.serviceDeskId,
          requestTypeId: options.serviceDesk.galleries.requestTypeId,
          requestFieldValues: {
            summary: 'Test set',
            description: 'h2. Test set\n\nAbout the set',
            'custom_field_001': req.body.setId,
            'custom_field_002': req.body.setCreatorNickname
          },
          raiseOnBehalfOf: req.body.email
        };
        mockJiraApiRequest(jiraApiRequestBody).reply(201);

        await middleware(req, res);

        expect(nock.isDone()).toBe(true);
      });
    });
  });
});
