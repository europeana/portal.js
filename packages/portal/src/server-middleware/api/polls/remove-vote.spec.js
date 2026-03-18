import sinon from 'sinon';

import { expressReqStub, expressResStub, expressNextStub } from '@test/utils.js';
import removeVoteHandler from '@/server-middleware/api/polls/remove-vote.js';
import pollsModel from '@/server-middleware/api/polls/model.js';
import keycloak from '@/server-middleware/api/keycloak.js';

describe('@/server-middleware/api/polls/remove-vote', () => {
  beforeEach(() => {
    sinon.stub(keycloak, 'userId').resolves(null);
    sinon.stub(pollsModel, 'findVoter').resolves(null);
    sinon.stub(pollsModel, 'findCandidate').resolves(null);
    sinon.stub(pollsModel, 'findVote').resolves(null);
    sinon.stub(pollsModel, 'deleteVote').resolves({});
  });

  afterEach(() => {
    sinon.restore();
  });

  it('authorizes request via keycloak', async() => {
    const authorization = 'Bearer token';
    const headers = { authorization };

    await removeVoteHandler(expressReqStub({ headers }), expressResStub(), expressNextStub());

    expect(keycloak.userId.calledWith(authorization)).toBe(true);
  });

  describe('when unauthorized', () => {
    it('calls next with 401 error', async() => {
      const next = expressNextStub();

      await removeVoteHandler(expressReqStub(), expressResStub(), next);

      expect(next.calledWith(sinon.match.has('status', 401))).toBe(true);
    });
  });

  describe('when authorized', () => {
    const keycloakUserId = 'keycloak-uuid';
    beforeEach(() => keycloak.userId.resolves(keycloakUserId));

    it('queries db model to find voter row for keycloak user id', async() => {
      await removeVoteHandler(expressReqStub(), expressResStub(), expressNextStub());

      expect(pollsModel.findVoter.calledWith(keycloakUserId)).toBe(true);
    });

    describe('when voter row is not found', () => {
      it('calls next with 403 error', async() => {
        const next = expressNextStub();

        await removeVoteHandler(expressReqStub(), expressResStub(), next);

        expect(next.calledWith(sinon.match.has('status', 403))).toBe(true);
      });
    });

    describe('when voter row is found', () => {
      const voterId = 17;
      beforeEach(() => pollsModel.findVoter.resolves({ id: voterId }));

      it('queries db model to find candidate row from req params', async() => {
        const candidateExternalId = 'new-feature';
        const params = { candidateExternalId };
        await removeVoteHandler(expressReqStub({ params }), expressResStub(), expressNextStub());

        expect(pollsModel.findCandidate.calledWith(candidateExternalId)).toBe(true);
      });

      describe('when candidate row is not found', () => {
        it('calls next with 404 error', async() => {
          const next = expressNextStub();

          await removeVoteHandler(expressReqStub(), expressResStub(), next);

          expect(next.calledWith(sinon.match.has('status', 404))).toBe(true);
        });
      });

      describe('when candidate row is found', () => {
        const candidateId = 10;
        beforeEach(() => pollsModel.findCandidate.resolves({ id: candidateId }));

        it('queries db model to check for an existing vote', async() => {
          await removeVoteHandler(expressReqStub(), expressResStub(), expressNextStub());

          expect(pollsModel.findVote.calledWith(voterId, candidateId)).toBe(true);
        });

        describe('when vote row does not exist', () => {
          it('calls next with 404 error', async() => {
            const next = expressNextStub();

            await removeVoteHandler(expressReqStub(), expressResStub(), next);

            expect(next.calledWith(sinon.match.has('status', 404))).toBe(true);
          });
        });

        describe('when vote row exists', () => {
          const voteId = 22;
          beforeEach(() => pollsModel.findVote.resolves({ id: voteId }));

          it('deletes vote from db', async() => {
            await removeVoteHandler(expressReqStub(), expressResStub(), expressNextStub());

            expect(pollsModel.deleteVote.calledWith(voteId)).toBe(true);
          });

          it('calls res.sendStatus with 204 status', async() => {
            const res = expressResStub();

            await removeVoteHandler(expressReqStub(), res, expressNextStub());

            expect(res.sendStatus.calledWith(204)).toBe(true);
          });
        });
      });
    });
  });
});
