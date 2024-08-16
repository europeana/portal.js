import pg from '../pg/pg.js';

// TODO: validate user login
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.sendStatus(503);
        return;
      }

      const { userExternalId, optionExternalId } = req.body;

      // if(notAuthorized) {
      //   res.sendStatus(401);
      // }

      let userRow;
      const selectUserResult = await pg.query(
        'SELECT id FROM polls.users WHERE external_id=$1',
        [userExternalId]
      );
      if (selectUserResult.rowCount > 0) {
        userRow = selectUserResult.rows[0];
      } else {
        // user doesn't exist, can't have voted on anything
        res.sendStatus(204);
        return;
      }

      let optionRow;
      const selectOptionResult = await pg.query(
        'SELECT id FROM polls.options WHERE external_id=$1',
        [optionExternalId]
      );
      if (selectOptionResult.rowCount > 0) {
        optionRow = selectOptionResult.rows[0];
      } else {
        // option doesn't exist, can't have been voted on
        res.sendStatus(204);
        return;
      }

      let voteRow;
      const selectVoteResult = await pg.query(
        'SELECT id FROM polls.votes WHERE user_id=$1 AND option_id=$2',
        [userRow.id, optionRow.id]
      );
      if (selectVoteResult.rowCount > 0) {
        voteRow = selectVoteResult.rows[0];
      } else {
        // vote doesn't exist, no need to remove
        res.sendStatus(204);
        return;
      }

      await pg.query(
        'DELETE FROM polls.votes WHERE id=$1',
        [voteRow.id]
      );
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(409);
      console.error(err);
    }
  };
};
