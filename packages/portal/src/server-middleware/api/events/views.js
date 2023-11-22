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

      const result = await pg.query(`
        SELECT COUNT(a.id) actions_count,
               SUM(h.occurrences) history_count
        FROM events.actions a
        LEFT JOIN events.objects o ON a.object_id=o.id
        LEFT JOIN events.action_types AT ON a.action_type_id=at.id
        LEFT JOIN events.history h ON h.action_type_id=at.id
        AND h.object_id=o.id
        WHERE o.uri=$1
          AND at.name='view';
        `,
      [url]
      );

      const viewCount = Number(result.rows[0]?.['actions_count']) + Number(result.rows[0]?.['history_count']);

      res.json({ viewCount });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };
};
