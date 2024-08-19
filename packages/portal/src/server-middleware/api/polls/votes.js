import pg from '../pg/pg.js';

// TODO: authorisation for current user before retrieving the userId
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.json([]);
        return;
      }

      const { optionIds, userExternalId } = req.body;

      let userRow = { id: null };
      if (userExternalId) {
        const selectUserResult = await pg.query(
          'SELECT id FROM polls.users WHERE external_id=$1',
          [userExternalId]
        );
        if (selectUserResult.rowCount > 0) {
          userRow = selectUserResult.rows[0];
        }
      }

      const votesForOptions = await pg.query(`
        SELECT o.external_id, COUNT(*) AS total, (SELECT COUNT(*) FROM polls.votes WHERE user_id=$2 AND option_id=o.id) AS votedByCurrentUser
          FROM polls.votes v LEFT JOIN polls.options o
          ON v.option_id=o.id
        WHERE o.external_id LIKE ANY('{$1}')
        GROUP BY (o.id)
        `,
      [optionIds, userRow.id]
      );

      if (votesForOptions.rowCount < 0) {
        // Nobody has voted on anything yet
        res.json([]);
        return;
      }

      res.json(votesForOptions.rows.reduce((memo, row) => {
        memo[row.id] = {
          total: row.total,
          votedByCurrentUser: row.votedByCurrentUser
        };
        return memo;
      }, {}));
    } catch (err) {
      console.error(err);
    }
  };
};
