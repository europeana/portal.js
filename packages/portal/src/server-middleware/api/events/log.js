import { Client } from 'pg';

let client;

// TODO: use `next` for error handling
export default (options = {}) => async(req, res) => {
  try {
    if (!client) {
      client = new Client(options);
      await client.connect();
    }

    let objectRow;
    const selectObjectResult = await client.query(
      'SELECT id FROM events.objects WHERE uri=$1',
      [req.body.objectUri]
    );

    if (selectObjectResult.rowCount > 0) {
      objectRow = selectObjectResult.rows[0];
    } else {
      const insertObjectResult = await client.query(
        'INSERT INTO events.objects (uri) VALUES($1) RETURNING id',
        [req.body.objectUri]
      );
      objectRow = insertObjectResult.rows[0];
    }

    await client.query(`
      INSERT INTO events.actions (object_id, action_type_id, occurred_at)
      SELECT $1, at.id, current_timestamp FROM events.action_types at WHERE at.name=$2
      `,
    [objectRow.id, req.body.actionType]
    );

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
