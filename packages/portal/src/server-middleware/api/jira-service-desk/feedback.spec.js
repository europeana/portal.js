import serviceDesk from '@/server-middleware/api/jira-service-desk/feedback';

import nock from 'nock';
import sinon from 'sinon';

const options = {
  origin: 'https://jira.example.org',
  serviceDesk: {
    feedback: {
      username: 'example@europeana.eu',
      password: 'YOUR_TOKEN',
      serviceDeskId: '7',
      requestTypeId: '81',
      customFields: {
        pageUrl: 'cf001',
        browser: 'cf002',
        screensize: 'cf003'
      }
    }
  }
};
const middleware = serviceDesk(options);

const mockRequest = (body = { feedback: 'Hello there, five word minimum :)' }) => ({ body });
const mockResponse = () => {
  const res = {};
  res.sendStatus = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  res.set = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};
const mockJiraApiRequest = (body) => nock(options.origin).post('/rest/servicedeskapi/request', body);
const expressNextStub = sinon.spy();

describe('server-middleware/api/jira-service-desk/feedback', () => {
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
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().reply(201);

        await middleware(req, res, expressNextStub);

        expect(nock.isDone()).toBe(true);
      });

      describe('Jira service desk API request POST body content', () => {
        it('includes serviceDeskId and requestTypeId from options', async() => {
          const req = mockRequest();
          const res = mockResponse();
          mockJiraApiRequest(body => (
            (body.serviceDeskId === options.serviceDesk.feedback.serviceDeskId) &&
            (body.requestTypeId === options.serviceDesk.feedback.requestTypeId)
          )).reply(201);

          await middleware(req, res, expressNextStub);

          expect(nock.isDone()).toBe(true);
        });

        it('uses full feedback for description field', async() => {
          const reqBody = {
            feedback: 'Hello there, five word minimum :)'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => body.requestFieldValues.description === reqBody.feedback).reply(201);

          await middleware(req, res, expressNextStub);

          expect(nock.isDone()).toBe(true);
        });

        it('responds with an error when the feedback is blank', async() => {
          const reqBody = {
            feedback: ''
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();

          await middleware(req, res, expressNextStub);
          expect(expressNextStub.calledWith(sinon.match.has('message', 'Invalid feedback.'))).toBe(true);
          expect(expressNextStub.calledWith(sinon.match.has('status', 400))).toBe(true);
        });

        it('responds with an error when the feedback is less than five words', async() => {
          const reqBody = {
            feedback: 'only three words'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();

          await middleware(req, res, expressNextStub);
          expect(expressNextStub.calledWith(sinon.match.has('message', 'Invalid feedback.'))).toBe(true);
          expect(expressNextStub.calledWith(sinon.match.has('status', 400))).toBe(true);
        });

        it('truncates feedback to 50 characters in summary field, removing newlines', async() => {
          const feedback = 'One,\r\nTwo,\r\nThree,\r\nFour,\r\nFive,\r\nSix,\r\nSeven,\r\nEight,\r\nNine,\r\nTen.';
          const summary = 'One, Two, Three, Four, Five, Six, Seven, Eight, Ni…';
          const reqBody = {
            feedback
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => body.requestFieldValues.summary === summary).reply(201);

          await middleware(req, res, expressNextStub);

          expect(nock.isDone()).toBe(true);
        });

        it('includes custom fields when available', async() => {
          const reqBody = {
            feedback: 'Hello there, five word minimum :)',
            pageUrl: 'www.example.eu',
            browser: 'Firefox',
            screensize: '1200 x 800'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => body.requestFieldValues[options.serviceDesk.feedback.customFields.pageUrl] === reqBody.pageUrl).reply(201);

          await middleware(req, res, expressNextStub);

          expect(nock.isDone()).toBe(true);
        });

        it('omits raiseOnBehalfOf if no email', async() => {
          const reqBody = {
            feedback: 'Hello there, five word minimum :)'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => !Object.keys(body).includes('raiseOnBehalfOf')).reply(201);

          await middleware(req, res, expressNextStub);

          expect(nock.isDone()).toBe(true);
        });

        it('includes raiseOnBehalfOf if email present', async() => {
          const reqBody = {
            feedback: 'Hello there, five word minimum :)',
            email: 'human@example.org'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => body.raiseOnBehalfOf === reqBody.email).reply(201);

          await middleware(req, res, expressNextStub);

          expect(nock.isDone()).toBe(true);
        });
      });
    });

    describe('response construction', () => {
      it('responds with upstream status on success', async() => {
        const status = 201;
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().reply(status);

        await middleware(req, res, expressNextStub);

        expect(res.sendStatus.calledWith(status)).toBe(true);
      });

      it('responds with upstream error on failure', async() => {
        const status = 400;
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().reply(status);

        await middleware(req, res, expressNextStub);

        expect(expressNextStub.calledWith(sinon.match.has('message', 'Request failed with status code 400'))).toBe(true);
      });

      it('responds with error on request failure', async() => {
        const errorMessage = 'Unknown error';
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().replyWithError(errorMessage);

        await middleware(req, res, expressNextStub);

        expect(expressNextStub.calledWith(sinon.match.has('message', errorMessage))).toBe(true);
      });
    });
  });
});
