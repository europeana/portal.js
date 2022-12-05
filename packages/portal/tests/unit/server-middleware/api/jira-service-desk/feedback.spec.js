import serviceDesk from '@/server-middleware/api/jira-service-desk/feedback';

import nock from 'nock';
nock.disableNetConnect();
import sinon from 'sinon';

const options = {
  origin: 'https://jira.example.org',
  serviceDesk: {
    feedback: {
      username: 'example@europeana.eu',
      password: 'YOUR_TOKEN',
      serviceDeskId: '7',
      requestTypeId: '81'
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
const mockJiraApiRequest = body => nock(options.origin).post('/rest/servicedeskapi/request', body);

describe('server-middleware/api/jira-service-desk/feedback', () => {
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

      describe('Jira service desk API request POST body content', () => {
        it('includes serviceDeskId and requestTypeId from options', async() => {
          const req = mockRequest();
          const res = mockResponse();
          mockJiraApiRequest(body => (
            (body.serviceDeskId === options.serviceDesk.feedback.serviceDeskId) &&
            (body.requestTypeId === options.serviceDesk.feedback.requestTypeId)
          )).reply(201);

          await middleware(req, res);

          expect(nock.isDone()).toBe(true);
        });

        it('uses full feedback for description field', async() => {
          const reqBody = {
            feedback: 'Hello there, five word minimum :)'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => body.requestFieldValues.description === reqBody.feedback).reply(201);

          await middleware(req, res);

          expect(nock.isDone()).toBe(true);
        });

        it('responds with an error when the feedback is blank', async() => {
          const reqBody = {
            feedback: ''
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();

          await middleware(req, res);
          expect(res.status.calledWith(400)).toBe(true);
          expect(res.send.calledWith('Invalid feedback.')).toBe(true);
        });

        it('responds with an error when the feedback is less than five words', async() => {
          const reqBody = {
            feedback: 'only three words'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();

          await middleware(req, res);
          expect(res.status.calledWith(400)).toBe(true);
          expect(res.send.calledWith('Invalid feedback.')).toBe(true);
        });

        it('truncates feedback to 50 characters in summary field', async() => {
          const feedback = 'One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.';
          const summary = 'One, Two, Three, Four, Five, Six, Seven, Eight, Ni…';
          const reqBody = {
            feedback
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => body.requestFieldValues.summary === summary).reply(201);

          await middleware(req, res);

          expect(nock.isDone()).toBe(true);
        });

        it('omits raiseOnBehalfOf if no email', async() => {
          const reqBody = {
            feedback: 'Hello there, five word minimum :)'
          };
          const req = mockRequest(reqBody);
          const res = mockResponse();
          mockJiraApiRequest(body => !Object.keys(body).includes('raiseOnBehalfOf')).reply(201);

          await middleware(req, res);

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

          await middleware(req, res);

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

        await middleware(req, res);

        expect(res.sendStatus.calledWith(status)).toBe(true);
      });

      it('responds with upstream error on failure', async() => {
        const status = 400;
        const errorMessage = 'Summary is required.';
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().reply(status, { errorMessage });

        await middleware(req, res);

        expect(res.status.calledWith(status)).toBe(true);
        expect(res.send.calledWith(errorMessage)).toBe(true);
      });

      it('responds with 500 status on request failure', async() => {
        const status = 500;
        const errorMessage = 'Unknown error';
        const req = mockRequest();
        const res = mockResponse();
        mockJiraApiRequest().replyWithError(errorMessage);

        await middleware(req, res);

        expect(res.status.calledWith(status)).toBe(true);
        expect(res.send.calledWith(errorMessage)).toBe(true);
      });
    });
  });
});
