import isbot from 'isbot';
import pg from '../pg/pg.js';

// TODO: use `next` for error handling
// TODO: accept multiple uris for the same action
// TODO: log user agent?
// TODO: validate action_types
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      // Respond early as clients don't need to wait for the results of this logging
      res.sendStatus(204);

      if (!pg.enabled || isbot(req.get('user-agent'))) {
        return;
      }

      const { actionType, objectUri, sessionId } = req.body;
      const url = new URL(objectUri);
      // Ignore any search query or hash
      const uri = `${url.origin}${url.pathname}`;

      let objectRow;
      const selectObjectResult = await pg.query(
        'SELECT id FROM events.objects WHERE uri=$1',
        [uri]
      );

      if (selectObjectResult.rowCount > 0) {
        objectRow = selectObjectResult.rows[0];
      } else {
        const insertObjectResult = await pg.query(
          'INSERT INTO events.objects (uri) VALUES($1) RETURNING id',
          [uri]
        );
        objectRow = insertObjectResult.rows[0];
      }

      let sessionRow;
      const selectSessionResult = await pg.query(
        'SELECT id FROM events.sessions WHERE uuid=$1',
        [sessionId]
      );

      if (selectSessionResult.rowCount > 0) {
        sessionRow = selectSessionResult.rows[0];
      } else {
        const insertSessionResult = await pg.query(
          'INSERT INTO events.sessions (uuid) VALUES($1) RETURNING id',
          [sessionId]
        );
        sessionRow = insertSessionResult.rows[0];
      }

      const selectActionResult = await pg.query(`
        SELECT a.id FROM events.actions a LEFT JOIN events.action_types at
          ON a.action_type_id=at.id
        WHERE a.object_id=$1
          AND at.name=$2
          AND a.session_id=$3
        `,
      [objectRow.id, actionType, sessionRow.id]
      );
      if (selectActionResult.rowCount > 0) {
        // this session has already logged this action type for this object; don't log it again
        return;
      }

      await pg.query(`
        INSERT INTO events.actions (object_id, action_type_id, session_id, occurred_at)
        SELECT $1, at.id, $2, CURRENT_TIMESTAMP
        FROM events.action_types at
        WHERE at.name=$3
        `,
      [objectRow.id, sessionRow.id, actionType]
      );
    } catch (err) {
      console.error(err);
    }
  };
};
