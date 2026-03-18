import { isbot } from 'isbot';
import pg from '../pg.js';

const logEvent = async({ action, object, session }) => {
  const url = new URL(object.uri);
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
    [session.uuid]
  );

  if (selectSessionResult.rowCount > 0) {
    sessionRow = selectSessionResult.rows[0];
  } else {
    const insertSessionResult = await pg.query(
      'INSERT INTO events.sessions (uuid, activated_at, activated_by) VALUES($1, $2, $3) RETURNING id',
      [session.uuid, session.activatedAt, session.activatedBy]
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
  [objectRow.id, action.type, sessionRow.id]
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
  [objectRow.id, sessionRow.id, action.type]
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

    let { action, actionType, object, objectUri, session, sessionId } = req.body;

    // TODO: rm actionType, objectUri and sessionId backwards-compabitility when
    //       action, object and session are established in production
    if (!action) {
      action = { type: actionType };
    }
    if (!object) {
      object = { uri: objectUri };
    }
    if (!session) {
      session = { id: sessionId };
    }

    for (const uri of [].concat(object.uri)) {
      await logEvent({ action, object: { uri }, session });
    }
  } catch (err) {
    next(err);
  }
};
