import { Client } from 'pg';
import isbot from 'isbot';

// TODO: use `next` for error handling
// TODO: end pg conn when done?
// TODO: accept multiple uris for the same action
// TODO: log user agent?
// TODO: validate action_types
export default (options = {}) => {
  let client;

  return async(req, res) => {
    try {
      // Respond early as clients don't need to wait for the results of this logging
      res.sendStatus(204);

      if (!options.enabled || isbot(req.get('user-agent'))) {
        return;
      }

      if (!client) {
        client = new Client(options);
        client.on('error', (err) => {
          console.error('PostgreSQL client error', err);
          client = null;
        });
        await client.connect();
      }

      const { actionType, objectUri, sessionId } = req.body;

      let objectRow;
      const selectObjectResult = await client.query(
        'SELECT id FROM events.objects WHERE uri=$1',
        [objectUri]
      );

      if (selectObjectResult.rowCount > 0) {
        objectRow = selectObjectResult.rows[0];
      } else {
        const insertObjectResult = await client.query(
          'INSERT INTO events.objects (uri) VALUES($1) RETURNING id',
          [objectUri]
        );
        objectRow = insertObjectResult.rows[0];
      }

      let sessionRow;
      const selectSessionResult = await client.query(
        'SELECT id FROM events.sessions WHERE uuid=$1',
        [sessionId]
      );

      if (selectSessionResult.rowCount > 0) {
        sessionRow = selectSessionResult.rows[0];
      } else {
        const insertSessionResult = await client.query(
          'INSERT INTO events.sessions (uuid) VALUES($1) RETURNING id',
          [sessionId]
        );
        sessionRow = insertSessionResult.rows[0];
      }

      const selectActionResult = await client.query(`
        SELECT a.id FROM events.actions a LEFT JOIN events.action_types at
          ON a.action_type_id=at.id
        WHERE a.object_id=$1
          AND at.name=$2
          AND a.session_id=$3
          AND a.occurred_at > (current_date - INTERVAL '1 day')
        `,
      [objectRow.id, actionType, sessionRow.id]
      );
      if (selectActionResult.rowCount > 0) {
        // this session has already logged this action type for this object in the
        // past 24 hours; don't log it again
        return;
      }

      await client.query(`
        INSERT INTO events.actions (object_id, action_type_id, session_id, occurred_at)
        SELECT $1, at.id, $2, current_timestamp
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
