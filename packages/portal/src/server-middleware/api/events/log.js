import isbot from 'isbot';
import pg from '../pg.js';

const logEvent = async({ actionType, activatedAt, activatedBy, objectUri, sessionId }) => {
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
      'INSERT INTO events.sessions (uuid, activated_at, activated_by) VALUES($1, $2, $3) RETURNING id',
      [sessionId, activatedAt, activatedBy]
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
};

// TODO: log user agent?
// TODO: validate action_types
export default async(req, res, next) => {
  try {
    // Respond early as clients don't need to wait for the results of this logging
    res.sendStatus(204);

    if (isbot(req.get('user-agent'))) {
      return;
    }

    const { actionType, activatedAt, activatedBy, objectUri, sessionId } = req.body;

    for (const eachObjectUri of [].concat(objectUri)) {
      await logEvent({ actionType, activatedAt, activatedBy, objectUri: eachObjectUri, sessionId });
    }
  } catch (err) {
    next(err);
  }
};
