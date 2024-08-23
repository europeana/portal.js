import sinon from 'sinon';

import { expressReqStub, expressResStub, expressNextStub } from '../../utils.js';
import votesHandler from '@/server-middleware/api/polls/votes.js';
import pollsModel from '@/server-middleware/api/polls/model.js';
import keycloak from '@/server-middleware/api/keycloak.js';

describe('@/server-middleware/api/polls/votes', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('authorizes request via keycloak', async() => {
    const authorization = 'Bearer token';
    const headers = { authorization };
    sinon.stub(keycloak, 'userId').resolves(null);
    sinon.stub(pollsModel, 'findVoter').resolves(null);
    sinon.stub(pollsModel, 'findVotes').resolves([]);

    await votesHandler(expressReqStub({ headers }), expressResStub(), expressNextStub());

    expect(keycloak.userId.calledWith(authorization)).toBe(true);
  });

  it('queries db model for authorized voter', async() => {
    const voterExternalId = 'keycloak uuid';
    sinon.stub(keycloak, 'userId').resolves(voterExternalId);
    sinon.stub(pollsModel, 'findVoter').resolves(null);
    sinon.stub(pollsModel, 'findVotes').resolves([]);

    await votesHandler(expressReqStub(), expressResStub(), expressNextStub());

    expect(pollsModel.findVoter.calledWith(voterExternalId)).toBe(true);
  });

  it('queries db model for votes on candidates (by voter)', async() => {
    const candidates = ['new-thing', 'improve-that'];
    const query = { candidate: 'new-thing,improve-that' };
    const voterExternalId = 'keycloak uuid';
    const voterId = 17;
    sinon.stub(keycloak, 'userId').resolves(voterExternalId);
    sinon.stub(pollsModel, 'findVoter').resolves({ id: voterId });
    sinon.stub(pollsModel, 'findVotes').resolves([]);

    await votesHandler(expressReqStub({ query }), expressResStub(), expressNextStub());

    expect(pollsModel.findVotes.calledWith(voterId, candidates)).toBe(true);
  });

  it('responds with votes data as json', async() => {
    const votes = [
      { 'external_id': 'new-thing', total: '10', 'voted_by_current_voter': '0' },
      { 'external_id': 'improve-that', total: '5', 'voted_by_current_voter': '1' }
    ];
    const votesResponse = {
      'new-thing': { total: '10', votedByCurrentVoter: false },
      'improve-that': { total: '5', votedByCurrentVoter: true }
    };
    sinon.stub(keycloak, 'userId').resolves(null);
    sinon.stub(pollsModel, 'findVoter').resolves(null);
    sinon.stub(pollsModel, 'findVotes').resolves(votes);
    const res = expressResStub();

    await votesHandler(expressReqStub(), res, expressNextStub());

    expect(res.json.calledWith(votesResponse)).toBe(true);
  });
});
