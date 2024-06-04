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
      const url = new URL(req.query?.url);
      // Ignore any search query or hash
      const uri = `${url.origin}${url.pathname}`;

      // TODO: update old objects, then stop using legacy uris
      // @/docker/compose/postgres/model/07-clean-up-blog-objects.psql
      const legacyUri = url.pathname.startsWith('/stories') ? `${url.origin}${url.pathname.replace('/stories', '/blog')}` : uri;

      const result = await pg.query(`
        SELECT SUM(views) AS views
        FROM
          (SELECT o.uri,
                  at.name AS action_type_name,
                  sum(h.occurrences) AS views
           FROM events.history h
           LEFT JOIN events.objects o ON h.object_id=o.id
           LEFT JOIN events.action_types AT ON h.action_type_id=at.id
           GROUP BY at.name,
                    o.uri
           UNION ALL SELECT o.uri,
                            at.name AS action_type_name,
                            count(a.id) AS views
           FROM events.actions a
           LEFT JOIN events.objects o ON a.object_id=o.id
           LEFT JOIN events.action_types AT ON a.action_type_id=at.id
           GROUP BY at.name,
                    o.uri) actions_and_history
        WHERE action_type_name='view' AND (uri=$1 OR uri=$2)
        `,
      [uri, legacyUri]
      );

      const viewCount = Number(result.rows[0]?.views);

      res.json({ viewCount });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };
};
