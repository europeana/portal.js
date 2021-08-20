import contentfulPlugin from '../../../plugins/contentful-graphql/plugin.server.js';
import { errorHandler } from '../index.js';

let plugin;

export default ($config) => (req, res) => {
  if (!plugin) {
    plugin = contentfulPlugin({ $config });
  }

  const alias = req.params.alias;
  const variables = JSON.parse(req.query.variables);
  const ifNoneMatch = req.get('If-None-Match');

  return plugin.etagMatches(alias, variables, ifNoneMatch)
    .then(match => {
      if (match) {
        res.status(304);
        res.end();
      } else {
        return plugin.query(alias, variables)
          .then(response => {
            res.set('cache-control', 'public, no-cache');
            res.set('etag', response.etag);
            res.set('content-type', 'application/json');
            res.send(response.data);
            res.end();
          })
          .catch(error => errorHandler(res, error));
      }
    });
};
