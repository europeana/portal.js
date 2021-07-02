import contentfulPlugin from '../../../plugins/contentful-graphql/plugin.server';
import { errorHandler } from '../';

export default ($config) => (req, res) => {
  return contentfulPlugin({ $config })
    .query(req.params.alias, JSON.parse(req.query.variables))
    .then(response => {
      const ifNoneMatch = req.get('If-None-Match');
      if (ifNoneMatch && ifNoneMatch === response.etag) {
        res.status(304);
        res.end();
      } else {
        res.set('cache-control', 'public, no-cache, must-revalidate, proxy-revalidate');
        res.set('etag', response.etag);
        res.send(response.data);
      }
    })
    .catch(error => errorHandler(res, error));
};
