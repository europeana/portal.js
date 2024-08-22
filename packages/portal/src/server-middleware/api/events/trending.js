import pg from '../pg.js';

export default async(req, res, next) => {
  try {
    const selectObjectResult = await pg.query(`
      SELECT uri,
             previous_score,
             current_score,
             CEIL(current_score ^ ((current_score - previous_score) / current_score)) trending_score,
             last_occurred_at
      FROM
        (SELECT current_scores.uri,
                COALESCE(SUM(current_scores.action_score), 0) current_score,
                COALESCE(SUM(previous_scores.action_score), 0) previous_score,
                GREATEST(MAX(current_scores.last_occurred_at), MAX(previous_scores.last_occurred_at)) last_occurred_at
         FROM
           (SELECT uri,
                   num * action_weight AS action_score,
                   last_occurred_at
            FROM
              (SELECT o.uri,
                      at.name,
                      COUNT(a.id) AS num,
                      MAX(a.occurred_at) AS last_occurred_at,
                      CASE
                          WHEN at.name = 'view' THEN 1
                          WHEN at.name = 'download' THEN 2
                          WHEN at.name = 'like' THEN 4
                          WHEN at.name = 'add' THEN 6
                          ELSE 0
                      END AS action_weight
               FROM events.actions a
               LEFT JOIN events.objects o ON a.object_id=o.id
               LEFT JOIN events.action_types AT ON a.action_type_id=at.id
               WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '1 day')
                 AND o.uri LIKE '%/item/%'
               GROUP BY o.uri,
                        at.name) AS action_counts) AS current_scores
         LEFT JOIN
           (SELECT uri,
                   num * action_weight AS action_score,
                   last_occurred_at
            FROM
              (SELECT o.uri,
                      at.name,
                      COUNT(a.id) AS num,
                      MAX(a.occurred_at) AS last_occurred_at,
                      CASE
                          WHEN at.name = 'view' THEN 1
                          WHEN at.name = 'download' THEN 2
                          WHEN at.name = 'like' THEN 4
                          WHEN at.name = 'add' THEN 6
                          ELSE 0
                      END AS action_weight
               FROM events.actions a
               LEFT JOIN events.objects o ON a.object_id=o.id
               LEFT JOIN events.action_types AT ON a.action_type_id=at.id
               WHERE a.occurred_at > (CURRENT_TIMESTAMP - INTERVAL '2 day')
                 AND a.occurred_at < (CURRENT_TIMESTAMP - INTERVAL '1 day')
                 AND o.uri LIKE '%/item/%'
               GROUP BY o.uri,
                        at.name) AS action_counts) AS previous_scores ON current_scores.uri=previous_scores.uri
         GROUP BY current_scores.uri) AS scores
      WHERE current_score > previous_score
      ORDER BY trending_score DESC,
               last_occurred_at DESC
      LIMIT 24
      `
    );

    res.json({ items: selectObjectResult.rows });
  } catch (err) {
    next(err);
  }
};
