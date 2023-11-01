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
        SELECT current_scores.uri,
               previous_scores.score previous_score,
               current_scores.score current_score,
               CEIL(current_scores.score ^ ((current_scores.score - previous_scores.score) / current_scores.score)) trending_score,
               current_scores.last_occurred_at
        FROM
          (SELECT o.uri,
                  COUNT(a.id) * CASE
                                    WHEN at.name = 'view' THEN 1
                                    WHEN at.name = 'download' THEN 2
                                    WHEN at.name = 'like' THEN 4
                                    WHEN at.name = 'add' THEN 6
                                    ELSE 0
                                END AS score,
                                MAX(a.occurred_at) AS last_occurred_at
           FROM events.actions a
           LEFT JOIN events.objects o ON a.object_id=o.id
           LEFT JOIN events.action_types AT ON a.action_type_id=at.id
           WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '1 day')
             AND o.uri LIKE '%/item/%'
           GROUP BY o.uri,
                    at.name
           ORDER BY score DESC) AS current_scores
        LEFT JOIN
          (SELECT o.uri,
                  COUNT(a.id) * CASE
                                    WHEN at.name = 'view' THEN 1
                                    WHEN at.name = 'download' THEN 2
                                    WHEN at.name = 'like' THEN 4
                                    WHEN at.name = 'add' THEN 6
                                    ELSE 0
                                END AS score,
                                MAX(a.occurred_at) AS last_occurred_at
           FROM events.actions a
           LEFT JOIN events.objects o ON a.object_id=o.id
           LEFT JOIN events.action_types AT ON a.action_type_id=at.id
           WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '2 day')
             AND a.occurred_at < (CURRENT_TIMESTAMP - INTERVAL '1 day')
             AND o.uri LIKE '%/item/%'
           GROUP BY o.uri,
                    at.name
           ORDER BY score DESC) AS previous_scores ON current_scores.uri=previous_scores.uri
        WHERE current_scores.score > previous_scores.score
        ORDER BY trending_score DESC,
                 last_occurred_at DESC
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
