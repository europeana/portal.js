import pg from './pg.js';

// TODO: use `next` for error handling
export default (config = {}) => {
  pg.config = config;

  return async(req, res) => {
    try {
      if (!pg.enabled) {
        res.json({ viewCount: 0 });
        return;
      }
      const url = req.query.url;

      const selectResult = await pg.query(`
        SELECT
          COUNT(*)
        FROM events.actions a
        LEFT JOIN events.objects o ON a.object_id=o.id
        LEFT JOIN events.action_types AT ON a.action_type_id=at.id
        WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '30 days')
          AND o.uri LIKE $1
          AND AT.name LIKE 'view'
        `,
        [url]
      );

      res.json({ viewCount: selectResult.rows[0].count });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };
};
