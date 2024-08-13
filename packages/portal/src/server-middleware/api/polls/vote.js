import pg from '../pg/pg.js';

// TODO: validate user login
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
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
        const insertUserResult = await pg.query(
          'INSERT INTO polls.users (external_id) VALUES($1) RETURNING id',
          [userExternalId]
        );
        userRow = insertUserResult.rows[0];
      }

      let optionRow;
      const selectOptionResult = await pg.query(
        'SELECT id FROM polls.options WHERE external_id=$1',
        [optionExternalId]
      );
      if (selectOptionResult.rowCount > 0) {
        optionRow =selectOptionResult.rows[0];
      } else {
        const insertOptionResult = await pg.query(
          'INSERT INTO polls.options (external_id) VALUES($1) RETURNING id',
          [optionExternalId]
        );
        optionRow = insertOptionResult.rows[0];
      };

      await pg.query(`
        INSERT INTO polls.votes (user_id, option_id, occurred_at)
        VALUES($1, $2, CURRENT_TIMESTAMP)
        `,
      [userRow.id, optionRow.id]
      );
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(409);
      console.error(err);
    }
  };
};