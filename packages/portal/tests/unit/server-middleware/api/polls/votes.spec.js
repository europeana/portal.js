import pg from 'pg';
import sinon from 'sinon';

import votesEventsHandler from '@/server-middleware/api/polls/votes';

const pgPoolQuery = sinon.stub().resolves({
  rows: [
    {
      'id': '5Ca2xEt6t10fxqMbvrw9aO',
      'count': 40
    }
  ]
});

const reqBody = { optionIDs: ['5Ca2xEt6t10fxqMbvrw9aO', '5Ca2xEt6t10fxqMbvrw9a1', '5Ca2xEt6t10fxqMbvrw9a2'], userExternalId: 'External-UUID' };

const expressReqStub = {
  body: reqBody,
  get: sinon.spy()
};
const expressResStub = {
  json: sinon.spy(),
  sendStatus: sinon.spy()
};

describe('@/server-middleware/api/polls/votes', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('when there is an external user ID', () => {
    // TODO: mock user SQL request
    describe('when some of the options have been voted on', () => {
      const options = { enabled: true };

      it('queries postgres for the votes', async() => {
        await votesEventsHandler(options)(expressReqStub, expressResStub);

        expect(pgPoolQuery.calledWith(
          sinon.match((sql) => sql.trim().startsWith('SELECT ')),
          [['5Ca2xEt6t10fxqMbvrw9aO', '5Ca2xEt6t10fxqMbvrw9a1', '5Ca2xEt6t10fxqMbvrw9a2'], 1]
        )).toBe(true);
      });

      it('responds with the view count as json', async() => {
        await votesEventsHandler(options)(expressReqStub, expressResStub);

        expect(expressResStub.json.calledWith({ '5Ca2xEt6t10fxqMbvrw9aO': 40 })).toBe(true);
      });
    });
  });

  describe('when there is NO external user ID', () => {
    // TODO: Add tests for anonymous retrieval
  });
});
