import pg from '../pg/pg.js';

// TODO: use `next` for error handling
// TODO: accept multiple uris for the same action
// TODO: log user agent?
// TODO: validate action_types
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        return;
      }

      const { optionIDs } = req.body;

      const votesForOptions = await pg.query(`
        SELECT o.external_id, COUNT(*) FROM polls.votes v LEFT JOIN polls.options o
          ON v.option_id=o.id
        WHERE o.external_id LIKE ANY('{$1}')
        GROUP BY (o.id)
        `,
      [optionIDs]
      );
      if (votesForOptions.rowCount < 0) {
        // Nobody has voted on anything yet
        res.json([]);
      }

      res.json(votesForOptions.rows.reduce((memo, row) => {
        memo[row.id] = row.count;
        return memo;
      }, {}));
    } catch (err) {
      console.error(err);
    }
  };
};
