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
        SELECT uri,
               SUM(action_score) score
        FROM
          (SELECT uri,
                  num * action_weight AS action_score
           FROM
             (SELECT o.uri,
                     at.name,
                     COUNT(a.id) AS num,
                     CASE
                         WHEN at.name = 'view' THEN 1
                         WHEN at.name = 'download' THEN 2
                         WHEN at.name = 'like' THEN 4
                         WHEN at.name = 'add' THEN 6
                         ELSE 0
                     END AS action_weight
              FROM events.actions a
              LEFT JOIN events.objects o ON a.object_id = o.id
              LEFT JOIN events.action_types AT ON a.action_type_id = at.id
              WHERE a.occurred_at > (CURRENT_DATE - INTERVAL '1 day')
                AND o.uri LIKE '%/item/%'
              GROUP BY o.uri,
                       at.name) AS action_counts) AS action_scores
        GROUP BY uri
        ORDER BY score DESC
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
