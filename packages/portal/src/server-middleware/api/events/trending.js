import { Client } from 'pg';

// TODO: use `next` for error handling
// TODO: end pg conn when done?
export default (options = {}) => {
  let client;

  return async(req, res) => {
    try {
      if (!options.enabled) {
        res.json({ items: [] });
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

      const selectObjectResult = await client.query(`
        SELECT o.uri, COUNT(a.id) AS num
        FROM events.actions a
        LEFT JOIN events.objects o ON a.object_id=o.id
        WHERE a.occurred_at > (current_date - INTERVAL '1 day')
        AND o.uri LIKE '%/item/%'
        GROUP BY o.uri
        ORDER BY num DESC
        LIMIT 10
        `
      );

      res.json({ items: selectObjectResult.rows });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };
};
