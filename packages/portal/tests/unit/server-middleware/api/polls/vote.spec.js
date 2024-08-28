import sinon from 'sinon';

import { expressReqStub, expressResStub, expressNextStub } from '../../utils.js';
import voteHandler from '@/server-middleware/api/polls/vote.js';
import pollsModel from '@/server-middleware/api/polls/model.js';
import keycloak from '@/server-middleware/api/keycloak.js';

describe('@/server-middleware/api/polls/vote', () => {
  beforeEach(() => {
    sinon.stub(keycloak, 'userId').resolves(null);
    sinon.stub(pollsModel, 'findVoter').resolves(null);
    sinon.stub(pollsModel, 'createVoter').resolves({});
    sinon.stub(pollsModel, 'findCandidate').resolves(null);
    sinon.stub(pollsModel, 'createCandidate').resolves({});
    sinon.stub(pollsModel, 'findVote').resolves(null);
    sinon.stub(pollsModel, 'createVote').resolves({});
  });

  afterEach(() => {
    sinon.restore();
  });

  it('authorizes request via keycloak', async() => {
    const authorization = 'Bearer token';
    const headers = { authorization };

    await voteHandler(expressReqStub({ headers }), expressResStub(), expressNextStub());

    expect(keycloak.userId.calledWith(authorization)).toBe(true);
  });

  describe('when unauthorized', () => {
    it('calls next with 401 error', async() => {
      const next = expressNextStub();

      await voteHandler(expressReqStub(), expressResStub(), next);

      expect(next.calledWith(sinon.match.has('status', 401))).toBe(true);
    });
  });

  describe('when authorized', () => {
    const keycloakUserId = 'keycloak-uuid';
    beforeEach(() => keycloak.userId.resolves(keycloakUserId));

    it('queries db model to find voter row for keycloak user id', async() => {
      await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

      expect(pollsModel.findVoter.calledWith(keycloakUserId)).toBe(true);
    });

    describe('when voter row is found', () => {
      const voterId = 17;
      beforeEach(() => pollsModel.findVoter.resolves({ id: voterId }));

      it('does not create new voter row', async() => {
        await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

        expect(pollsModel.createVoter.called).toBe(false);
      });
    });

    describe('when voter row is not found', () => {
      it('creates new voter row', async() => {
        await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

        expect(pollsModel.createVoter.calledWith(keycloakUserId)).toBe(true);
      });
    });

    it('queries db model to find candidate row from req params', async() => {
      const candidateExternalId = 'new-feature';
      const params = { candidateExternalId };
      await voteHandler(expressReqStub({ params }), expressResStub(), expressNextStub());

      expect(pollsModel.findCandidate.calledWith(candidateExternalId)).toBe(true);
    });

    describe('when candidate row is found', () => {
      const candidateId = 10;
      beforeEach(() => pollsModel.findCandidate.resolves({ id: candidateId }));

      it('does not create new candidate row', async() => {
        await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

        expect(pollsModel.createCandidate.called).toBe(false);
      });
    });

    describe('when candidate row is not found', () => {
      const candidateExternalId = 'new-feature';

      it('creates new candidate row', async() => {
        await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

        expect(pollsModel.createCandidate.calledWith(candidateExternalId)).toBe(false);
      });
    });

    it('queries db model to check for an existing vote', async() => {
      const voterId = 17;
      pollsModel.findVoter.resolves({ id: voterId });
      const candidateId = 10;
      pollsModel.findCandidate.resolves({ id: candidateId });

      await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

      expect(pollsModel.findVote.calledWith(voterId, candidateId)).toBe(true);
    });

    describe('when vote row already exists', () => {
      beforeEach(() => pollsModel.findVote.resolves({}));

      it('calls next with 409 error', async() => {
        const next = expressNextStub();

        await voteHandler(expressReqStub(), expressResStub(), next);

        expect(next.calledWith(sinon.match.has('status', 409))).toBe(true);
      });
    });

    describe('when vote row does not already exist', () => {
      it('creates vote in db', async() => {
        const voterId = 17;
        pollsModel.findVoter.resolves({ id: voterId });
        const candidateId = 10;
        pollsModel.findCandidate.resolves({ id: candidateId });

        await voteHandler(expressReqStub(), expressResStub(), expressNextStub());

        expect(pollsModel.createVote.calledWith(voterId, candidateId)).toBe(true);
      });

      it('calls res.sendStatus with 204 status', async() => {
        const res = expressResStub();

        await voteHandler(expressReqStub(), res, expressNextStub());

        expect(res.sendStatus.calledWith(204)).toBe(true);
      });
    });
  });
});
