import pg from './pg.js';

// TODO: use `next` for error handling
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.json({ items: [] });
        return;
      }

      const selectObjectResult = await pg.query(`
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
