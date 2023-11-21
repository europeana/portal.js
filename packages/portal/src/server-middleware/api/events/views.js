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
      const url = req.query?.url;

      const sessionResult = await pg.query(`
        SELECT
          COUNT(*)
        FROM events.actions a
        LEFT JOIN events.objects o ON a.object_id=o.id
        LEFT JOIN events.action_types at ON a.action_type_id=at.id
        WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '30 days')
          AND o.uri=$1
          AND at.name='view'
          AND a.session_id IS NOT NULL
        `,
      [url]
      );
      const sessionCount = Number(sessionResult.rows[0]?.count);

      const sessionlessResult = await pg.query(`
        SELECT
          occurrences AS count
        FROM events.actions a
        LEFT JOIN events.objects o ON a.object_id=o.id
        LEFT JOIN events.action_types at ON a.action_type_id=at.id
        WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '30 days')
          AND o.uri=$1
          AND at.name='view'
          AND a.session_id IS NULL
        `,
      [url]
      );
      const sessionlessCount = Number(sessionlessResult.rows[0]?.count);

      res.json({ viewCount: sessionCount + sessionlessCount });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };
};
