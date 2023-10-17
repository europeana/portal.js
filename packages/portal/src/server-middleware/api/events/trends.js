import { Client } from 'pg';

let client;

// TODO: use `next` for error handling
export default (options = {}) => async(req, res) => {
  try {
    if (!client) {
      client = new Client(options);
      await client.connect();
    }

    const selectObjectResult = await client.query(`
      SELECT o.uri, COUNT(a.id) AS num
      FROM events.actions a
      LEFT JOIN events.objects o ON a.object_id=o.id
      WHERE a.occurred_at > (current_date - INTERVAL '1 day')
      GROUP BY o.uri
      ORDER BY num DESC
      LIMIT 4
      `
    );

    res.json({ items: selectObjectResult.rows });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
